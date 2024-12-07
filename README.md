# 2ad.com

public code for (2ad website)[https://www.2ad.com]


### Test Server

```
$ sh test.sh
```

### Deployment

#### get started with submodules
```bash
$ git submodule update --recursive --init --force
```

1. `bun install --include=dev --frozen-lockfile`
2. `cdk synth`
3. `cdk deploy`
...
4. `cdk destroy`
