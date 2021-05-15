# functionsフォルダについて

## 初回セットアップ

```bash
$ firebase init
# Firebaseプロジェクトを設定
```

## 環境変数のセット

```bash
$ firebase functions:config:set A.B="XXX"
# Firebase Functionsの環境変数にAカテゴリができて、その中のBにXXXが設定される
```

## エミュレーターの起動

```bash
$ firebase functions:config:get > .runtimeconfig.json
# .runtimeconfig.jsonにFirebase Functionsの環境変数が書き込まれる

$ cd ./functions
$ npm run serve
# エミュレーター起動
```
