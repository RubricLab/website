// This file was generated by basehub. Do not edit directly. Read more: https://basehub.com/docs/api-reference/basehub-sdk

/* eslint-disable */
/* eslint-disable eslint-comments/no-restricted-disable */
/* tslint:disable */

// @ts-nocheck
import type {
  QueryGenqlSelection,
  Query,
  MutationGenqlSelection,
  Mutation,
} from './schema'
import {
  linkTypeMap,
  createClient as createClientOriginal,
  generateGraphqlOperation,
  type FieldsSelection,
  type GraphqlOperation,
  type ClientOptions,
  GenqlError,
} from './runtime'
export type { FieldsSelection } from './runtime'
export { GenqlError }

import types from './types'
export {
  fragmentOn,
  fragmentOnRecursiveCollection,
  type QueryGenqlSelection,
} from './schema'
const typeMap = linkTypeMap(types as any)

export interface Client {
  query<R extends QueryGenqlSelection>(
    request: R & { __name?: string },
  ): Promise<FieldsSelection<Query, R>>

  mutation<
R extends Omit<MutationGenqlSelection, "transaction" | "transactionAwaitable"> & {
      transaction?: {
        __args: Omit<
          NonNullable<MutationGenqlSelection["transaction"]>["__args"],
          "data"
        > & { data: Transaction | string };
      };
      transactionAwaitable?: TransactionStatusGenqlSelection & {
        __args: Omit<
          NonNullable<MutationGenqlSelection["transactionAwaitable"]>["__args"],
          "data"
        > & { data: Transaction | string };
      };
    },
>(
    request: R & { __name?: string },
  ): Promise<FieldsSelection<Mutation, R>>
}

const createClient = function (options?: ClientOptions): Client {
  const { url, headers } = getStuffFromEnv(options)
  return createClientOriginal({
    url: url.toString(),
    ...options,
    headers: { ...options?.headers, ...headers },
    queryRoot: typeMap.Query!,
    mutationRoot: typeMap.Mutation!,
    subscriptionRoot: typeMap.Subscription!,
  }) as any
}

export const everything = {
  __scalar: true,
}

export type QueryResult<fields extends QueryGenqlSelection> = FieldsSelection<
  Query,
  fields
>
export const generateQueryOp: (
  fields: QueryGenqlSelection & { __name?: string },
) => GraphqlOperation = function (fields) {
  return generateGraphqlOperation('query', typeMap.Query!, fields as any)
}

export type MutationResult<fields extends MutationGenqlSelection> =
  FieldsSelection<Mutation, fields>
export const generateMutationOp: (
  fields: MutationGenqlSelection & { __name?: string },
) => GraphqlOperation = function (fields) {
  return generateGraphqlOperation('mutation', typeMap.Mutation!, fields as any)
}


export const getStuffFromEnv = (options) => {
    const defaultEnvVarPrefix = "BASEHUB";

    options = options || {};
    if (options.token === undefined) {
      options.token = undefined || null;
    }
    if (options.prefix === undefined) {
      options.prefix = undefined || null;
    }
    // we'll use the draft from .env if available
    if (!options.draft && true) {
      options.draft = true;
    }

    const buildEnvVarName = (name) => {
      let prefix = defaultEnvVarPrefix;
      if (options.prefix) {
        if (options.prefix.endsWith("_")) {
          options.prefix = options.prefix.slice(0, -1); // we remove the trailing _
        }
  
        if (options.prefix.endsWith(name)) {
          // remove the name from the prefix
          options.prefix = options.prefix.slice(0, -name.length);
        }
  
        // the user may include BASEHUB in their prefix...
        if (options.prefix.endsWith(defaultEnvVarPrefix)) {
          prefix = options.prefix;
        } else {
          // ... if they don't, we'll add it ourselves.
          prefix = `${options.prefix}_${defaultEnvVarPrefix}`;
        }
      }
      // this should result in something like <prefix>_BASEHUB_{TOKEN,REF,DRAFT} or BASEHUB_{TOKEN,REF,DRAFT}
      return `${prefix}_${name}`;
    };

    const getEnvVar = (name: EnvVarName) => process.env[buildEnvVarName(name)];

    const parsedDebugForcedURL = getEnvVar("DEBUG_FORCED_URL");
    const parsedBackwardsCompatURL = getEnvVar("URL");

    const backwardsCompatURL = parsedBackwardsCompatURL
      ? new URL(parsedBackwardsCompatURL)
      : undefined;


    const basehubUrl = new URL(
      parsedDebugForcedURL
        ? parsedDebugForcedURL
        : `https://api.basehub.com/graphql`
    );

    // These params can either come disambiguated, or in the URL.
    // Params that come from the URL take precedence.

    const parsedBasehubTokenEnv = getEnvVar("TOKEN");
    const parsedBasehubRefEnv = getEnvVar("REF");
    const parsedBasehubDraftEnv = getEnvVar("DRAFT");
    const parsedBasehubApiVersionEnv = getEnvVar("API_VERSION");

    let tokenNotFoundErrorMessage = `🔴 Token not found. Make sure to include the ${buildEnvVarName(
      "TOKEN"
    )} env var.`;

    const resolveTokenParam = (token) => {
      if (!token) return null;
      const isRaw = token.startsWith("bshb_");
      if (isRaw) return token;
      tokenNotFoundErrorMessage = `🔴 Token not found. Make sure to include the ${token} env var.`;
      return process.env[token] ?? ''; // empty string to prevent fallback
    };

    const resolvedToken = resolveTokenParam(options?.token ?? null);

    const token =
      resolvedToken ?? basehubUrl.searchParams.get("token") ??
      parsedBasehubTokenEnv ??
      (backwardsCompatURL
        ? backwardsCompatURL.searchParams.get("token")
        : undefined) ??
      null;

    if (!token) {
      throw new Error(tokenNotFoundErrorMessage);
    }

    let draft =
       basehubUrl.searchParams.get("draft") ??
      parsedBasehubDraftEnv ??
      (backwardsCompatURL
        ? backwardsCompatURL.searchParams.get("draft")
        : undefined) ??
      false;

    if (options?.draft !== undefined) {
      draft = options.draft;
    }

    let apiVersion =
      basehubUrl.searchParams.get("api-version") ??
      parsedBasehubApiVersionEnv ??
      (backwardsCompatURL
        ? backwardsCompatURL.searchParams.get("api-version")
        : undefined) ??
      "2";

      if (options?.apiVersion !== undefined) {
        apiVersion = options.apiVersion;
      }
  
    // 2. let's validate the URL

    if (basehubUrl.pathname.split("/")[1] !== "graphql") {
        throw new Error(`🔴 Invalid URL. The URL needs to point your repo's GraphQL endpoint, so the pathname should end with /graphql.`);
    }

    // we'll pass these via headers
    basehubUrl.searchParams.delete("token");
    basehubUrl.searchParams.delete("ref");
    basehubUrl.searchParams.delete("draft");
    basehubUrl.searchParams.delete("api-version");

    // 3.
    const gitBranch = "main";
    const gitCommitSHA = "58e254f54e7d2769132a1888168cba86ecbf14d6";

    return {
      isForcedDraft: true,
      draft,
      url: basehubUrl,
      headers: {
        "x-basehub-token": token,
        "x-basehub-ref": resolvedRef.ref,
        ...(gitBranch ? { "x-basehub-git-branch": gitBranch } : {}),
        ...(gitCommitSHA ? { "x-basehub-git-commit-sha": gitCommitSHA } : {}),
        ...(gitBranchDeploymentURL ? { "x-basehub-git-branch-deployment-url": gitBranchDeploymentURL } : {}),
        ...(productionDeploymentURL ? { "x-basehub-production-deployment-url": productionDeploymentURL } : {}),
        ...(draft ? { "x-basehub-draft": "true" } : {}),
        ...(apiVersion ? { "x-basehub-api-version": apiVersion } : {}),
      },
    };
}
import type { Transaction } from './api-transaction';
import type { TransactionStatusGenqlSelection } from './schema';


export type * from "@basehub/mutation-api-helpers";
import { createFetcher } from "./runtime";

export const sdkBuildId = "bshb_sdk_71a101c320bfe";
export const resolvedRef = {"repoHash":"d31a5e44bf9996a2","type":"branch","ref":"main","createSuggestedBranchLink":null,"id":"LpKFNfZvJVwJQA74BLP8f","name":"main","createdAt":"2024-05-11T22:56:22.904Z","headCommitId":"jIBMjT5vCO9FpExCNYQ5B","isDefault":true,"deletedAt":null,"workingRootBlockId":"KG5y18bhCrgFx01OLYEFw"};
export const gitBranchDeploymentURL = null;
export const productionDeploymentURL = null;

/**
 * Returns a hash code from an object
 * @param  {Object} obj The object to hash.
 * @return {String}    A hash string
 */
function hashObject(obj: Record<string, unknown>): string {
    const sortObjectKeys = <O extends Record<string, unknown>>(obj: O): O => {
        if (!isObjectAsWeCommonlyCallIt(obj)) return obj;
        return Object.keys(obj)
            .sort()
            .reduce((acc, key) => {
                acc[key as keyof O] = obj[key as keyof O];
                return acc;
            }, {} as O);
    };

    const recursiveSortObjectKeys = <O extends Record<string, unknown>>(obj: O): O => {
        const sortedObj = sortObjectKeys(obj);

        if (!isObjectAsWeCommonlyCallIt(sortedObj)) return sortedObj;

        Object.keys(sortedObj).forEach((key) => {
            if (isObjectAsWeCommonlyCallIt(sortedObj[key as keyof O])) {
                sortedObj[key as keyof O] = recursiveSortObjectKeys(
                    sortedObj[key as keyof O] as O
                ) as O[keyof O];
            } else if (Array.isArray(sortedObj[key as keyof O])) {
                sortedObj[key as keyof O] = (sortedObj[key as keyof O] as unknown[]).map(
                    (item) => {
                        if (isObjectAsWeCommonlyCallIt(item)) {
                            return recursiveSortObjectKeys(item);
                        } else {
                            return item;
                        }
                    }
                ) as O[keyof O];
            }
        });

        return sortedObj;
    };

    const isObjectAsWeCommonlyCallIt = (
        obj: unknown
    ): obj is Record<string, unknown> => {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };

    const sortedObj = recursiveSortObjectKeys(obj);
    const str = JSON.stringify(sortedObj);

    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
}

// we limit options to only the ones we want to expose.
type Options = Omit<ClientOptions, 'url' | 'method' | 'batch' | 'credentials' | 'fetch' | 'fetcher' | 'headers' | 'integrity' | 'keepalive' | 'mode' | 'redirect' | 'referrer' | 'referrerPolicy' | 'window'> & { draft?: boolean, token?: string }

// we include the resolvedRef.id to make sure the cache tag is unique per basehub ref
// solves a nice problem which we'd otherwise have, being that if the dev wants to hit a different basehub branch, we don't want to respond with the same cache tag as the previous branch
export function cacheTagFromQuery(query: QueryGenqlSelection) {
  const now = performance.now();
  const result = "basehub-" + hashObject({ ...query, refId: resolvedRef.id });
  return result;
}

/**
 * Create a basehub client.
 *
 * @param options (optional) Options for the `fetch` request; for example in Next.js, you can do `{ next: { revalidate: 60 } }` to tweak your app's cache.
 * @returns A basehub client.
 *
 * @example
 * import { basehub } from 'basehub'
 *
 * const firstQuery = await basehub().query({
 *   __typename: true,
 * });
 *
 * console.log(firstQuery.__typename) // => 'Query'
 *
 */
export const basehub = (options?: Options) => {
  const { url, headers } = getStuffFromEnv(options);

  if (!options) {
    options = {};
  }

  options.getExtraFetchOptions = (op, _body, originalRequest) => {
    if (op !== 'query') return {}

    // don't override if we're in draft mode
    if (true) return {}

    // don't override if revalidation is already being handled by the user
    if (typeof options?.next !== 'undefined') return {}

    const cacheTag = cacheTagFromQuery(originalRequest)
    return { next: { tags: [cacheTag] }, headers: { 'x-basehub-sdk-build-id': "bshb_sdk_71a101c320bfe", 'x-basehub-cache-tag': cacheTag }}
  }

  return {
    ...createClient(
// force revalidate to undefined on purpose as it can't coexist with cache: 'no-store'
// we use cache: 'no-store' as we're in draft mode. in prod, we won't touch this.
{ ...options, cache: 'no-store', next: { ...options?.next, revalidate: undefined } }),
    raw: createFetcher({ ...options, url, headers }) as <Cast = unknown>(
      gql: GraphqlOperation
    ) => Promise<Cast>,
  };
};

basehub.replaceSystemAliases = createClientOriginal.replaceSystemAliases;
