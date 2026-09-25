# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

**HAIR SALON TOKI**（表参道の美容室）のサービスサイトです。Claude Design で作った静的サイトで、ビルドツール・フレームワーク・パッケージ管理は使っていません。素の HTML と共通 CSS 1本で、JS は共通の `js/nav.js`（スマホ・タブレットのメニュー開閉）と、予約フォームのインラインスクリプトだけです。

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
css/style.css   全ページ共通のスタイルシート（1ファイルのみ。末尾にレスポンシブ用の @media）
js/nav.js       MENU ボタンでナビのオーバーレイを開閉（全ページで defer 読み込み）
images/         hero-main / style-01〜04 / staff-01〜03 / ogp（すべて JPG）
docs/           CONTENTS.md・DESIGN.md（仕様書）
```

## 開発・確認

ビルドは不要です。ローカルでは静的サーバーで配信して確認します。

```sh
python3 -m http.server 8000   # → http://localhost:8000/
```

リンクはすべて相対パス（`./css/...`、`staff.html`）なので、サブディレクトリに置いても動きます。例外はフッターの `/privacy-policy`・`/law` で、ルート絶対パスになっています。

## マークアップの規約

- **ヘッダー・フッターは各 HTML にコピーされています**（共通化の仕組みはありません）。ナビやフッターを変えるときは7ページすべてを同じように編集します。現在地は該当ナビリンクの `aria-current="page"` で示します。
- 下層ページの共通パターン：`section.page-hero` の中に `header.site-header`、巨大な透かし文字 `.page-hero__watermark`（DESIGN.md のウォーターマーク・ヒーロー）、パンくず、h1、リードを置きます。
- クラス名は BEM 風です（`block__element--modifier`）。トップページ専用のブロックには `home-` を付けます（`.home-hero`、`.home-style` など）。
- ページの下地はダーク（`#0D0D0D`）で、ライトセクションには `.light` クラスを付けます。DESIGN.md のとおり明暗を交互に重ねてリズムを作ります。
- 見出しの英字は Anton の大文字（`.section-heading__title--xl`、`.page-hero__title`）で、小さなラベルは `.eyebrow`（Inter 11px、字間 .3em、例: `02 — STYLE`）です。
- 画像には必ず `alt`・`width`・`height` を付けます。ファーストビュー以外は `loading="lazy"` にします。alt 文言は CONTENTS.md の指定に合わせます。
- 英語テキストの要素には `lang="en"` を付けます。
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

- フォントは Google Fonts から各 HTML の `<head>` で読み込みます（Anton、Inter 400–600、Noto Sans JP 400–900）。
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
- 確認は 1440 / 1024 / 768 / 390 / 320px で、横スクロールが出ないことを見ます。

## 既知のギャップ・TODO

作業するときは次の点に気をつけてください。勝手に直さず、関係する作業のときにユーザーに確認します。

1. **レスポンシブは PC ベースの上書き方式**：DESIGN.md は「モバイルファースト」ですが、Claude Design の PC デザインを崩さないように、PC を基準に `max-width` で上書きしています。DESIGN.md 11章の「CONTACT」ピルは、このサイトでは予約導線の「RESERVE」にしています。
2. **予約フォームは送信しません**：`index.html` と `reserve.html` の末尾のスクリプトは、ボタンの表示を切り替えるだけです（`TODO` コメントあり）。送信先（予約システム・メール API）は未定です。
3. **仮リンク**：SNS リンクは `href="#"` です。`/privacy-policy` と `/law` のページはまだありません。
4. **仮の店舗情報**：住所・電話（`03-0000-0000`）・Google マップの埋め込み（現状は「表参道駅」で検索）はすべて仮です。
5. **OGP**：`og:image` が相対パス（`./images/ogp.jpg`）です。ドメインが決まったら絶対 URL にします。`og:url` も未設定です。
6. グローバルナビには CONCEPT がありません（フッターにはあります）。CONTENTS.md のナビ順とは違うので、変えるときは確認します。
7. CONTENTS.md のスタッフ名には崩れた仮名があります（「佐藤 elena」「中村 optional」）。サイト側は「佐藤 エレナ / ELENA SATO」「中村 悠 / YU NAKAMURA」です。また `staff-01.jpg`（佐藤 エレナ）は男性、`staff-02.jpg`（高橋 蓮）は女性の写真で、名前と写真の印象が合っていない可能性があります。

## デザイン判断の原則（DESIGN.md より）

- ミニマル・洗練・本格的。写真とタイポグラフィで見せ、装飾・イラスト・派手なアイコンは避けます。
- スタイル写真とスタッフ写真は自然な発色のカラーのままにします（グレースケール化しません）。
- コントラスト比は 4.5:1 以上にします（明暗が切り替わった直後も同じです）。
- DESIGN.md にない新しい UI 要素が必要になったら、先にユーザーに確認するか、このデザインシステムに沿った形で提案します。
