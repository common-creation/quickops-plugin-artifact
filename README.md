# quickops-plugin-artifact

[QuickOps](https://quickops.sh)に成果物などをアーティファクトとして保存する[lscbuild](https://github.com/common-creation/lscbuild)プラグイン

![](https://i.imgur.com/zEjk4d8.png)

## 使い方

```yaml
version: 1
jobs:
  example:
    steps:
      # some steps
      - use: common-creation/quickops-plugin-artifact#main
        env:
          - ARTIFACT_PATH=./dist
```

## 環境変数

| キー | 挙動 | 必須 | デフォルト値 |
| ---- | ---- | ---- | ---- |
| ARTIFACT_PATH | zip圧縮する対象の絶対パス。 `.` から始まる場合はリポジトリルートからの相対パス | ✅ | - |
| ARTIFACT_NAME | アーティファクトのファイル名 | - | artifact.zip |