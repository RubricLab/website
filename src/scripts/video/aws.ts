import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { $ } from 'bun'

interface AWSConfig {
	accessKeyId?: string
	secretAccessKey?: string
	region: string
}

interface DeployConfig {
	sourceDir: string
	bucketName: string
	cfDistributionId?: string // Optional, for updates to existing distribution
	aws: AWSConfig
}

export async function deployToAWS(config: DeployConfig): Promise<{
	bucketName: string
	cfDomain: string
	cfDistributionId: string
}> {
	// Set AWS environment variables if provided
	if (config.aws.accessKeyId) process.env.AWS_ACCESS_KEY_ID = config.aws.accessKeyId
	if (config.aws.secretAccessKey) process.env.AWS_SECRET_ACCESS_KEY = config.aws.secretAccessKey
	process.env.AWS_DEFAULT_REGION = config.aws.region

	// Validate source directory
	if (!existsSync(config.sourceDir))
		throw new Error(`Source directory not found: ${config.sourceDir}`)

	console.log('🚀 Starting AWS deployment...')

	// 1. Create bucket if it doesn't exist
	try {
		await $`aws s3api head-bucket --bucket ${config.bucketName}`.quiet()
		console.log(`✅ Using bucket: ${config.bucketName}`)
	} catch {
		console.log(`📦 Creating bucket: ${config.bucketName}...`)
		await $`aws s3 mb s3://${config.bucketName}`
	}

	// 2. Set S3 CORS configuration
	console.log('🔄 Configuring S3 CORS...')
	const corsConfig = JSON.stringify({
		CORSRules: [
			{
				AllowedHeaders: ['*'],
				AllowedMethods: ['GET', 'HEAD'],
				AllowedOrigins: ['*'],
				ExposeHeaders: ['ETag', 'Content-Length'],
				MaxAgeSeconds: 86400
			}
		]
	})

	// Using echo pipe to aws CLI to avoid writing temporary files
	await $`echo ${corsConfig} | aws s3api put-bucket-cors --bucket ${config.bucketName} --cors-configuration file:///dev/stdin`

	// 3. Upload files
	console.log('📤 Uploading files to S3...')
	await $`aws s3 sync ${config.sourceDir} s3://${config.bucketName}/hero/ --acl private`

	// 4. Set proper content types and cache headers
	console.log('🔄 Setting content types...')

	// Using Bun's shell features to handle command quoting properly
	// Use double quotes for CLI parameters with --exclude and --include
	const excludeParam = ['--exclude', '*']
	const m3u8IncludeParam = ['--include', '*.m3u8']
	const tsIncludeParam = ['--include', '*.ts']

	await $`aws s3 cp s3://${config.bucketName}/hero/hls/ s3://${config.bucketName}/hero/hls/ ${excludeParam} ${m3u8IncludeParam} --content-type application/vnd.apple.mpegurl --cache-control max-age=300 --metadata-directive REPLACE --recursive`

	await $`aws s3 cp s3://${config.bucketName}/hero/hls/ s3://${config.bucketName}/hero/hls/ ${excludeParam} ${tsIncludeParam} --content-type video/mp2t --cache-control max-age=31536000 --metadata-directive REPLACE --recursive`

	// 5. CloudFront setup
	let distributionId = config.cfDistributionId
	let distributionDomain = ''

	// Use AWS managed SimpleCORS policy
	const corsHeadersPolicyId = '60669652-455b-4ae9-85a4-c4c02393f86c'
	console.log('Using AWS managed SimpleCORS policy')

	if (!distributionId) {
		console.log('🔄 Creating new CloudFront distribution...')

		// Create OAC for S3 access
		try {
			await $`aws cloudfront create-origin-access-control --origin-access-control-config '{"Name":"VideoOAC","Description":"Video OAC","SigningProtocol":"sigv4","SigningBehavior":"always","OriginAccessControlOriginType":"s3"}'`.quiet()
		} catch {}

		// Get OAC ID
		const oacId = (
			await $`aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='VideoOAC'].Id" --output text`.quiet()
		).stdout
			.toString()
			.trim()

		// Create CloudFront distribution
		const distConfig = {
			CacheBehaviors: {
				Items: [
					{
						AllowedMethods: {
							Items: ['GET', 'HEAD', 'OPTIONS'],
							Quantity: 3
						},
						CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
						OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf',
						PathPattern: '*.m3u8',
						ResponseHeadersPolicyId: corsHeadersPolicyId,
						TargetOriginId: 'S3Origin',
						ViewerProtocolPolicy: 'redirect-to-https'
					},
					{
						AllowedMethods: {
							Items: ['GET', 'HEAD', 'OPTIONS'],
							Quantity: 3
						},
						CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
						OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf',
						PathPattern: '*.ts',
						ResponseHeadersPolicyId: corsHeadersPolicyId,
						TargetOriginId: 'S3Origin',
						ViewerProtocolPolicy: 'redirect-to-https'
					}
				],
				Quantity: 2
			},
			CallerReference: `hero-video-${Date.now()}`,
			Comment: 'Hero Video Distribution',
			DefaultCacheBehavior: {
				AllowedMethods: {
					Items: ['GET', 'HEAD', 'OPTIONS'],
					Quantity: 3
				},
				CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
				OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf', // CachingOptimized
				ResponseHeadersPolicyId: corsHeadersPolicyId, // CORS-S3Origin
				TargetOriginId: 'S3Origin', // SimpleCORS
				ViewerProtocolPolicy: 'redirect-to-https'
			},
			DefaultRootObject: 'hero/hls/master.m3u8',
			Enabled: true,
			HttpVersion: 'http2and3',
			IsIPV6Enabled: true,
			Origins: {
				Items: [
					{
						DomainName: `${config.bucketName}.s3.${config.aws.region}.amazonaws.com`,
						Id: 'S3Origin',
						OriginAccessControlId: oacId,
						OriginPath: '',
						S3OriginConfig: { OriginAccessIdentity: '' }
					}
				],
				Quantity: 1
			},
			PriceClass: 'PriceClass_All'
		}

		await writeFile('cf-config.json', JSON.stringify(distConfig, null, 2))

		// Create distribution
		console.log('🔄 Creating CloudFront distribution (this may take a few minutes)...')
		const cfOutput =
			await $`aws cloudfront create-distribution --distribution-config file://cf-config.json`
		const cfData = JSON.parse(cfOutput.stdout.toString())

		distributionId = cfData.Distribution.Id
		distributionDomain = cfData.Distribution.DomainName
		console.log(`✅ CloudFront distribution created: ${distributionId}`)

		// Set bucket policy for CloudFront
		const accountId = (await $`aws sts get-caller-identity --query Account --output text`).stdout
			.toString()
			.trim()
		const bucketPolicy = JSON.stringify({
			Statement: [
				{
					Action: 's3:GetObject',
					Condition: {
						StringEquals: {
							'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${distributionId}`
						}
					},
					Effect: 'Allow',
					Principal: { Service: 'cloudfront.amazonaws.com' },
					Resource: `arn:aws:s3:::${config.bucketName}/*`,
					Sid: 'AllowCloudFrontAccess'
				}
			],
			Version: '2012-10-17'
		})

		// Using echo pipe to aws CLI to avoid writing temporary files
		await $`echo ${bucketPolicy} | aws s3api put-bucket-policy --bucket ${config.bucketName} --policy file:///dev/stdin`
	} else {
		console.log(`🔄 Using existing CloudFront distribution: ${distributionId}`)

		// Get domain name from existing distribution
		distributionDomain = (
			await $`aws cloudfront get-distribution --id ${distributionId} --query 'Distribution.DomainName' --output text`
		).stdout
			.toString()
			.trim()
	}

	// Create invalidation to apply changes immediately
	console.log('🔄 Creating CloudFront invalidation...')
	await $`aws cloudfront create-invalidation --distribution-id ${distributionId} --paths "/hero/*"`

	console.log('\n🎉 Deployment complete!')
	console.log(`🪣 S3 Bucket: ${config.bucketName}`)
	console.log(`🌐 CloudFront Domain: https://${distributionDomain}/hero/hls/master.m3u8`)
	console.log(`🆔 Distribution ID: ${distributionId}`)

	return {
		bucketName: config.bucketName,
		cfDistributionId: distributionId || '',
		cfDomain: distributionDomain
	}
}

// deployToAWS({
// 	sourceDir: './processed',
// 	bucketName: 'rubric-website',
// 	aws: { region: 'us-east-1' }
// })
