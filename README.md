# leaflet-tilelayer-jsonld
JSON-LD context and tools for leaflet-tilelayer

## 目的

* TileLayer の初期化に必要な情報を javascript のコードから分離することで、再利用を容易にすること
* JSON-LD フォーマットで情報記述することで、そのまま LOD としても解釈できるようにすること
* Creative Commons ライセンスや追加のメタデータなどを適切に保持できるようにすること


## for GIS Developer

### プラグイン

<http://frogcat.github.io/leaflet-tilelayer-jsonld/leaflet-tilelayer-jsonld.js">

L.tileLayer.jsonld 関数を定義します。
element id で特定される HTML 要素の中身を JSON-LD としてパースし、
その内容を元に TileLayer を生成して返します。

    var tilelayer = L.tileLayer.jsonld("element id");

HTML 要素は特に区別はしませんが、以下のように JSON-LD を埋め込むための script 要素が推奨されます。


    <script type="application/ld+json" id="tile"> ... </script>





### デモ

<http://frogcat.github.io/leaflet-tilelayer-jsonld/example.html>

### ソース

```example.html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>leaflet-tilelayer-jsonld</title>
<link rel="stylesheet" href="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
<script src="//cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
<script src="//frogcat.github.io/leaflet-tilelayer-jsonld/leaflet-tilelayer-jsonld.js"></script>
<script type="application/ld+json" id="tile">
{
	"@context" : "http://frogcat.github.io/leaflet-tilelayer-jsonld/context.jsonld",
	"@type" : "cc:Work",
	"@id" : "http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png",
	"rdfs:label" : "歴史的農業景観閲覧システム",
	"rdfs:description" : "明治時代初期に作成された「第一軍管区地方2万分1迅速測図原図」および「五千分一東京図測量原図」のタイル画像",
	"cc:license" : "http://creativecommons.org/licenses/by/2.1/jp/",
	"cc:attributionName" : "歴史的農業環境閲覧システム(NIAES)",
	"cc:attributionURL" : "http://habs.dc.affrc.go.jp/",
	"cc:useGuidelines" : "http://habs.dc.affrc.go.jp/habs_faq.html",
	"minZoom" : 8,
	"maxZoom" : 16
}
</script>
</head>
<body style="width: 100%; height: 100%; overflow: hidden;">
	<div id="map" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;"></div>
	<script>
		L.map("map", {
			zoom : 16,
			minZoom : 10,
			center : [ 36.09894, 139.96672 ],
			layers : [ L.tileLayer.jsonld("tile") ]
		});
	</script>
</body>
</html>
```

1. leaflet-tilelayer-jsonld.js をインクルードします
2. タイルの情報を <script type="application/ld+json" id="tile">...</script> にエンコードします
3. L.tileLayer.jsonld(id for JSON-LD script) 関数によってタイルレイヤーを作成します

* @context, @type は決まり文句です
* @id にタイルのテンプレート URL が入ります
* rdfs:label, rdfs:description にはそれぞれタイトル、説明文を記述できます
* cc:* のプロパティには、[Creative Commons : Work Properties](https://creativecommons.org/ns) を記述できます
* cc:* のプロパティから適切な attribution が作成されます
* minZoom, maxZoom などの TileLayer オプションはそのまま記述してください

### ポイント

* コードとデータを分離することで、コードの見通しがよくなります
* データ部分に説明や注意事項、ライセンスが書いてあるので、再利用の判断が簡単になります
* 再利用できる場合には script 部分をコピーすればいいので使いまわしが簡単に
* Creative Commons のライセンス情報を適切に保持することができます


## for LOD Developer

schema.org の JSON-LD を HTML に埋め込むのと同様の手法で、
地図タイルデータセットに関するメタデータが HTML に埋め込まれていることになります。


### JSON-LD Context

TileLayer のための JSON-LD Context を定義しています。

<http://frogcat.github.io/leaflet-tilelayer-jsonld/context.jsonld>

* Creative Commons, RDF, RDFS, Dublin Core のネームスペースを定義
* いくつかのプロパティについては "@type" : "@id" を定義することで URL として解釈させる
* TileLayer 固有のプロパティは http://example.org/ 配下として処理

### 処理例

上記の JSON-LD を単独で抜き出してファイル化したものがこちらです。

<http://frogcat.github.io/leaflet-tilelayer-jsonld/example.jsonld>

これを RDF パーサに処理させて Turtle 形式にすると以下のような出力が得られます。

```out.ttl
@prefix ex:  <http://example.org/> .
@prefix dc:  <http://purl.org/dc/terms/> .
@prefix cc:  <http://creativecommons.org/ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

<http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png>
        rdf:type            cc:Work ;
        cc:attributionName  "歴史的農業環境閲覧システム(NIAES)" ;
        cc:attributionURL   <http://habs.dc.affrc.go.jp/> ;
        cc:license          <http://creativecommons.org/licenses/by/2.1/jp/> ;
        cc:useGuidelines    <http://habs.dc.affrc.go.jp/habs_faq.html> ;
        ex:maxZoom          16 ;
        ex:minZoom          8 ;
        rdfs:description    "明治時代初期に作成された「第一軍管区地方2万分1迅速測図原図」および「五千分一東京図測量原図」のタイル画像" ;
        rdfs:label          "歴史的農業景観閲覧システム" .

```

### ポイント

* 地図タイルデータセットを RDF として表出させる効果
* ホストの HTML と地図タイルデータの暗黙の依存関係を抽出した解析
* 地図タイルデータセットの抽出・収集・再利用 への応用など

