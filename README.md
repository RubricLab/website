# Website

This project is for [Rubric Labs](https://rubriclabs.com)' website.

It was bootstrapped with [`create-rubric-app`](https://www.npmjs.com/package/create-rubric-app).

To install the dependencies, run:

```bash
bun i
```

To run the dev server, run:

```bash
bun dev
```

Open [localhost:3000](http://localhost:3000) in your browser to see the result.

You can start modifying the UI by editing [src/app/page.tsx](./src/app/page.tsx). The page auto-updates as you edit the file.

### Deployment

To serve your app to users, simply deploy the Next.js app eg. on [Railway](https://railway.app/new) or [Vercel](https://deploy.new/).

To persist data, you'll need a database. Both [Railway](https://docs.railway.app/databases/postgresql) and [Vercel](https://vercel.com/docs/storage/vercel-postgres) provide Postgres DBs. You'll simply need to change the [Prisma provider](./prisma/schema.prisma) to `"postgresql"` (and add an extra URL for Vercel: [example](https://github.com/vercel/examples/blob/main/storage/postgres-prisma/prisma/schema.prisma#L9C1-L11C74)).

## Learn More

To learn more about this project, take a look at this [blog post](https://rubriclabs.com/blog/cra).
