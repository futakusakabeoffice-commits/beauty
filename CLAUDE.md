# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

**HAIR SALON TOKI**（表参道の美容室）のサービスサイトです。Claude Design で作った静的サイトで、ビルドツール・フレームワーク・パッケージ管理は使っていません。素の HTML と共通 CSS 1本、JS は `js/` の外部ファイルだけです（HTML にインラインの JS・CSS は書きません。例外は JSON-LD の `<script type="application/ld+json">` だけです）。

- 店名・スタッフ名・価格・住所・電話番号は**仮のサンプル**です（CONTENTS.md では「（仮）」付き）。実際の店舗情報が確定したら差し替えます。
- 仕様書は2つあり、役割が分かれています。
  - `docs/CONTENTS.md`：テキストと構成の正（ソース・オブ・トゥルース）。文言・メニュー・価格・クーポン・店舗情報はここに従います。
  - `docs/DESIGN.md`：見た目の正。色・フォント・余白・コンポーネント・レスポンシブ・アクセシビリティのルールはここに従います。
- 文言を変更するときは、HTML と `docs/CONTENTS.md` を**両方**更新して揃えます。

## 構成

```
index.html      トップ（HERO / CONCEPT / STYLE / STAFF / MENU / COUPON / ACCESS / RESERVE フォーム）
concept.html    コンセプト下層
style.html      スタイルギャラリー（#style-01〜04 はトップからのリンク先）
staff.html      スタッフ紹介
menu.html       メニュー＋クーポン（#coupon）
access.html     アクセス（情報リスト＋Google マップ iframe）
reserve.html    予約フォーム
privacy-policy.html  プライバシーポリシー（ドラフト。公開前に内容確認が必要）
404.html        404 ページ（どの階層でも表示されるため、リンクはルート絶対パス `/…`・noindex）
css/style.css   全ページ共通のスタイルシート（1ファイルのみ。末尾にレスポンシブ用の @media）
js/nav.js       Web フォントの有効化＋MENU ボタンでナビのオーバーレイを開閉＋埋め込み表示時の遷移後の位置を先頭へ（全ページ）
js/track.js     GA4 のコンバージョンイベント（予約フォーム送信 generate_lead・電話タップ tel_tap）。gtag がある時だけ送信（全ページ）
js/coupon.js    ?coupon=… でフォームのクーポンを選択し「適用中」を表示（index・reserve）
js/reserve-form.js  予約フォームの送信時の表示切り替え（index・reserve）
images/         写真は WebP（原寸＋幅640pxの `-640.webp`、srcset で出し分け）、ogp.jpg は 1200×630
favicon.ico ほか    favicon-16/32・apple-touch-icon(180)・icon-192/512・site.webmanifest（ロゴ「TOKI」から生成）
robots.txt      全許可＋Sitemap 行
sitemap.xml     公開8ページ（404 を除く）。ページを足したら追記し lastmod を更新
netlify.toml    Netlify のビルド設定。サイトのファイルだけを dist/ にコピーして公開（docs/・tools/・CLAUDE.md は公開しない）
tools/update-font-subset.py  Noto Sans JP のサブセット URL を再生成
docs/           CONTENTS.md・DESIGN.md（仕様書）
```

## 公開（Netlify）

- 公開 URL：https://salon-toki.netlify.app/ （Netlify のプロジェクト名 `salon-toki`）
- デプロイは Netlify MCP の deploy-site で表示されるコマンドをリポジトリ直下で実行します。Netlify 側で `netlify.toml` のビルドが走り、`dist/` が公開されます。
- 公開ファイルを増やしたら（新しい画像フォルダ・ファイル種別など）、`netlify.toml` のコピー対象にも追加します。
- canonical・og:url・og:image・JSON-LD・sitemap.xml・robots.txt は `https://salon-toki.netlify.app/` の絶対 URL です。独自ドメインに移すときは `salon-toki.netlify.app` を全ファイルで置き換えます。

## 開発・確認

ビルドは不要です。ローカルでは静的サーバーで配信して確認します。

```sh
python3 -m http.server 8000   # → http://localhost:8000/
```

リンクはすべて相対パス（`./css/...`、`staff.html`）です。例外は `404.html` だけで、ルート絶対パス（`/css/...`）にしています。

## マークアップの規約

- **ヘッダー・フッターは各 HTML にコピーされています**（共通化の仕組みはありません）。ナビやフッターを変えるときは7ページすべてを同じように編集します。現在地は該当ナビリンクの `aria-current="page"` で示します。
- 下層ページの共通パターン：`section.page-hero` の中に `header.site-header`、巨大な透かし文字 `.page-hero__watermark`（DESIGN.md のウォーターマーク・ヒーロー）、パンくず、h1、リードを置きます。
- クラス名は BEM 風です（`block__element--modifier`）。トップページ専用のブロックには `home-` を付けます（`.home-hero`、`.home-style` など）。
- ページの下地はダーク（`#0D0D0D`）で、ライトセクションには `.light` クラスを付けます。DESIGN.md のとおり明暗を交互に重ねてリズムを作ります。
- 見出しの英字は Anton の大文字（`.section-heading__title--xl`、`.page-hero__title`）で、小さなラベルは `.eyebrow`（Inter 11px、字間 .3em、例: `02 — STYLE`）です。
- 画像には必ず `alt`・`width`・`height` を付けます。ファーストビュー以外は `loading="lazy"` にします。alt 文言は CONTENTS.md の指定に合わせます。
- 写真は WebP（品質80）で、`src` に原寸、`srcset` に `-640.webp` と原寸、`sizes` にレイアウト上の表示幅を書きます。
- `<head>` は全ページ同じ構成です：title（「ページ内容 | HAIR SALON TOKI」全角28字前後）、description（140字以上）、robots、OGP 一式、twitter:card、theme-color、favicon 類、manifest、Web フォント、CSS、JSON-LD（HairSalon＋下層は BreadcrumbList）。ページを足すときはこれを揃え、title・description は CONTENTS.md にも書きます。
- 英語テキストの要素には `lang="en"` を付けます。
- クーポン：「このクーポンを使う」は `?coupon=first|weekday|referral` を付けて予約フォームへ飛ばします（トップは `?coupon=…#reservation`、メニューは `reserve.html?coupon=…#reserve-form`）。値はフォームの `select[name=coupon]` の option と一致させます。クーポンを増やすときは、両フォームの option とリンクの両方に追加します。
- 各ページの `header.site-header` には、PC 用ナビ `nav#site-nav` と、スマホ・タブレット用の `.site-header__actions`（RESERVE ピル＋MENU ボタン）の両方があります。ヘッダーを変えるときは両方を揃えます。

## CSS の規約

- デザイントークンは `:root` の CSS 変数で持っています。**色やフォントを直書きせず変数を使います**（DESIGN.md 8章）。

  | 変数 | 値 | DESIGN.md の役割 |
  | --- | --- | --- |
  | `--c-bg` | `#0D0D0D` | Background Dark |
  | `--c-light` | `#F5F5F0` | Background（ライト） |
  | `--c-ink` | `#111` | Primary／ライト面の本文 |
  | `--c-accent` | `#E8432E` | Secondary（**局所使用のみ**。現状はリンクのホバー程度） |
  | `--c-chip` | `#EDEDED` | タグバッジ背景 |
  | `--c-line-light` | `#DADADA` | Border |
  | `--c-muted` / `--c-line` | 白の半透明 | ダーク面の薄い文字／罫線 |
  | `--f-display` / `--f-latin` / `--f-jp` | Anton / Inter / Noto Sans JP | 見出し／英数字／日本語 |

- フォントは Google Fonts から読み込みます（Anton、Inter 400–600、Noto Sans JP 400–900）。表示を止めないよう `media="print"` で読み込み、`js/nav.js` で有効にします。
- Noto Sans JP はサイトで使う文字だけのサブセット（`text=`）です。**日本語の文言を変えたら `python3 tools/update-font-subset.py` を実行**して URL を更新します（忘れると新しい文字だけ Hiragino などに置き換わります）。
- `--shrink`（1440px の設計幅に対する不足分）を使って、巨大な表示用文字を画面幅に合わせて縮めています。
- ボタン：ピル形（`border-radius: 999px`、`14px 32px`、ホバーで `translateY(-1px)`）。フォーム送信は黒のシャープな矩形。カードは影なしのフラットです。
- 余白は 8px グリッド（8 / 16 / 32 / 64 / 128px）に合わせます。

## レスポンシブ

ベースのスタイルは PC（1440px 設計）です。`css/style.css` の末尾で、幅の狭い順に上書きしています。新しいセクションを足すときは、この3つのブロックにも対応するルールを追加します。

| ブロック | 範囲 | 主な変更 |
| --- | --- | --- |
| `@media (max-width: 1279px)` | 狭い PC | `--gutter: 64px`、固定幅カラムを縮める、クーポンを2段、トップのメニューの左ラベル列をなくす |
| `@media (max-width: 1023px)` | タブレット以下 | `--gutter: 40px`、ヘッダーを RESERVE ピル＋円形 MENU ボタン（右上に固定）に切り替え、ナビを全画面オーバーレイに、2カラムを1カラムに |
| `@media (max-width: 639px)` | スマホ | `--gutter: 24px`、スタッフは2列（3人目は横長で全幅）、スタイル・メニューは写真→本文の縦積み、フッターは1カラム（ロゴ→SNS→リンク→ポリシー） |

- 左右の余白は `--gutter` で管理しています（PC 120px → 64 → 40 → 24px）。
- 巨大な英字見出しはブレイクポイントごとに `font-size` を明示しています（PC の `--shrink` 計算は 1024px 以上だけで効きます）。
- 確認は 1440 / 1024 / 768 / 375 / 320px で、横スクロールが出ないことを見ます。
- 変更後は Lighthouse（モバイル）で各カテゴリ 90 以上を保ちます。

## 既知のギャップ・TODO

作業するときは次の点に気をつけてください。勝手に直さず、関係する作業のときにユーザーに確認します。

1. **レスポンシブは PC ベースの上書き方式**：DESIGN.md は「モバイルファースト」ですが、Claude Design の PC デザインを崩さないように、PC を基準に `max-width` で上書きしています。DESIGN.md 11章の「CONTACT」ピルは、このサイトでは予約導線の「RESERVE」にしています。
2. **予約フォームは送信しません**：`js/reserve-form.js` は表示を切り替えるだけです（`TODO` コメントあり）。送信先（予約システム・メール API）は未定です。
3. **仮リンク**：フッターの SNS リンクは仮のアカウント URL（`hairsalon_toki_sample`）で、新しいタブで開きます。本番の URL が決まったら全ページと CONTENTS.md を差し替えます。`law.html`（特商法）はまだありません。`privacy-policy.html` はドラフトです。
4. **仮の店舗情報**：住所・電話（`03-0000-0000`）・Google マップの埋め込み（現状は「表参道駅」で検索）・JSON-LD の店舗情報はすべて仮です。コンセプトの写真（CONTENTS.md の `concept-interior.jpg`）は未用意で、`hero-main.webp` を仮に使っています。
5. **ドメイン**：現在は Netlify のサブドメイン（salon-toki.netlify.app）です。独自ドメインにする場合は URL の置き換えと、Netlify で www 有無の統一（301）を設定します。
6. グローバルナビには CONCEPT がありません（フッターにはあります）。CONTENTS.md のナビ順とは違うので、変えるときは確認します。
7. **計測**：GA4 は未設置です。`js/track.js` のイベントは gtag を入れると送信されます。GA4 を入れたら、プライバシーポリシー7章（アクセス解析ツール）の内容を確認します。

## デザイン判断の原則（DESIGN.md より）

- ミニマル・洗練・本格的。写真とタイポグラフィで見せ、装飾・イラスト・派手なアイコンは避けます。
- スタイル写真とスタッフ写真は自然な発色のカラーのままにします（グレースケール化しません）。
- コントラスト比は 4.5:1 以上にします（明暗が切り替わった直後も同じです）。
- DESIGN.md にない新しい UI 要素が必要になったら、先にユーザーに確認するか、このデザインシステムに沿った形で提案します。
