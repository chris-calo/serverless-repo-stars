# ⚡️ Serverless Cloud - Repo Stars

Retrieves live stars for the Serverless Framework and Serverless Cloud
public GitHub repositories, for user-interfaces.

The live results can be seen [for the Framework, on the Serverless site.](https://deploy-preview-740--serverless.netlify.app/)

### Usage – Meat and Potatoes

Access repository data via the production end-points:

```
  HTTP GET
  https://scalable-code-5mm52.cloud.serverless.com/cloud/stars

  HTTP GET
  https://scalable-code-5mm52.cloud.serverless.com/framework/stars
```

A successful message looks like this:

```json
{
  "ok": true,
  "status": 200,
  "stars": 40380
}
```

An error message, which you'll hopefully never see, is like so:

```json
{
  "ok": false,
  "status": 500,
  "message": "A problem has occurred, because sometimes problems occur"
}
```

### Implementation – Nuts and Bolts

Under the surface, this just uses a vanilla instance of Serverless Cloud.
This uses the public version of the GitHub API, which doesn't require
OAuth verification. However, this imposes stricter rate limitations, thus
both stars are only fetched once every 3 minutes using Cloud's `schedule`
interface. Good results are cached for later retrieval.

Internally, a fairly-comprehensive error-handler exists. This all
culminates to a general-purpose middleware like JSON response resolver.

Repositories to query are implemented based on an internal string enum
(`Product`), which is easy to modify for the inclusion of additional
repoositories in the future.

### License – Null and Void

lol jk. Who cares, do what you want with this.
