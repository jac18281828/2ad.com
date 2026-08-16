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

### Infrastructure ownership

This app defines the family sites listed in `cdk/site-config.ts` and nothing else.
Each other `2ad.com` subdomain is owned by its own repository, which defines its own
bucket, certificate, distribution and DNS records:

| Subdomain | Repository |
| --- | --- |
| `emomtimer.2ad.com` | [emomtimer](https://github.com/jac18281828/emomtimer) |
| `solitare.2ad.com` | [solitare](https://github.com/jac18281828/solitare) |
| `playmmix.2ad.com` | [playmmix](https://github.com/jac18281828/playmmix) |

The `2ad.com` public hosted zone (`Z09862671HYH6ZFKNPGNL`) was created by hand and is
managed by no CloudFormation stack in any repository. Every stack imports it read-only
and creates only its own records. Nothing here may create, mutate or delete the zone
itself — a stack that took ownership of it would take every `2ad.com` site down the
first time it was destroyed.
