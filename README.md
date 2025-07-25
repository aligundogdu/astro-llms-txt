# @aligundogdu/astro-llms-txt

This **[Astro integration](https://docs.astro.build/en/guides/integrations-guide/)** generates a llms.txt based on your
pages when you build your Astro project.


# Manuel Install

```
yarn add astro-llms-txt-generator
```

//astro.config.mjs

```
import llmsTxtIntegration from "astro-llms-txt-generator";
...
...
...
export default defineConfig({
    ...
    integrations: [llmsTxtIntegration()],
    ...
});
```

```
yarn build
```

## License

MIT

Copyright (c) 2025 [@aligundogdu](https://aligundogdu.com)


