$(function(){
    var regexp = new RegExp('^https?://');
    $('a').each(function() {
        var href = $(this).attr('href');
        if (regexp.test(href)) {
            $(this).attr('target', '_blank');
            //$(this).attr('rel', 'noopener nofollow');
        }
    });

    $('a[href^="#"]').click(function(){
        var speed = 500;
        var href= $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $("html, body").animate({scrollTop:position}, speed, "swing");
        return false;
    });

    function searchByKeyword1(keywd, articles) {
        let result = articles.filter( article => {
            return article.keyword1.find(k => k == keywd);
        });
        return result;
    };
    function searchByKeyword2(keywd, articles) {
        let result;
        if (keywd == "java") {
            result = articles.filter( article => {
                let ex = "javascript";
                return (article.keyword1.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                        article.keyword2.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                        article.title.toLowerCase().indexOf(keywd) >= 0 && article.title.toLowerCase().indexOf(ex) < 0);
            });
        } else {
            result = articles.filter( article => {
                return (article.keyword1.find(k => k.startsWith(keywd)) ||
                        article.keyword2.find(k => k.startsWith(keywd)) ||
                        article.title.toLowerCase().indexOf(keywd) >= 0);
            });
        }
        return result;
    };
    function normalizeQuery(query) {
        query = query.toLowerCase();
        query = query.replace(/[ 　	]+/g, ' ');
        query = query.trim();
        return query;
    }
    function searchArticles(query, articles) {
        query = normalizeQuery(query);
        var result1 = [];
        var result2 = [];
        if (query == "") {
            result2 = articles;
        } else {
            result1 = articles;
            var words = query.split(' ');
            for (var i = 0; i < words.length; i++) {
                var w = words[i];
                result1 = searchByKeyword1(w, result1);
            }
            result2 = articles.filter ( a => {
                return result1.indexOf(a) < 0;
            });
            for (var i = 0; i < words.length; i++) {
                var w = words[i];
                result2 = searchByKeyword2(w, result2);
            }
        }
        var title1 = "\"" + query + "\" の記事";
        var title2 = "\"" + query + "\" の含まれる記事";
        switch (query) {
        case "":
            title2 = "すべての記事(最新順)";
            break;

        case "#linux_commands":
            title1 = "Linuxコマンドの記事";
            break;
        case "#numerical_analysis":
            title1 = "数値計算/シミュレーションの記事";
            break;
        case "#natural_language_processing":
            title1 = "自然言語処理の記事";
            break;
        case "#lang_compare":
            title1 = "プログラミング言語比較の記事";
            break;

        case "aws":
            title1 = "AWSに関する記事";
            break;

        case "scala":
            title1 = "Scala - 言語別記事";
            break;
        case "java":
            title1 = "Java - 言語別記事";
            break;

        case "elasticsearch":
            title1 = "Elasticsearch - ソフトウェア別記事";
            break;
        case "fluentd":
            title1 = "fluentd - ソフトウェア別記事";
            break;
        case "kibana":
            title1 = "Kibana - ソフトウェア別記事";
            break;
        case "metabase":
            title1 = "Metabase - ソフトウェア別記事";
            break;
        case "postgresql":
            title1 = "PostgreSQL - ソフトウェア別記事";
            break;
        case "tex":
            title1 = "TeX - ツール別記事";
            break;

        case "#qiita":
            title1 = "Qiitaの記事";
            break;
        case "#hatenablog":
            title1 = "はてなブログの記事";
            break;

        }
        if (result2.length == 0) {
            title2 = "";
        } else if (result1.length == 0) {
            title1 = title2;
            title2 = "";
        }
        var count = result1.length + result2.length;
        return {
            title1: title1,
            articles1: result1,
            title2: title2,
            articles2: result2,
            count: count,
        };
    }
    function getImageHtml(query) {
        switch(query) {
        case "#linux_commands":
            return '<p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>';
        default:
            return '';
        }
    }
    function extractSynonymIndex(keywds) {
        var len = keywds.length;
        for (var i = 0; i < len; i++) {
            switch(keywds[i]) {
            case "javascript":
                keywds.push("js");
                break;
            case "vuejs":
                keywds.push("vue.js");
                break;
            case "#natural_language_processing":
                keywds.push("nlp");
                break;
            }
        }
        return keywds;
    }
    var articles = {
        list: [],
    };
    axios.get(articles_json_url).then(response => {
        var list = response.data;
        for (var i = 0; i < list.length; i++) {
            if (list[i]["updated"] == "") {
                list[i]["date"] = list[i]["posted"];
            } else {
                list[i]["date"] = list[i]["posted"] + "投稿 " + list[i]["updated"] + "更新";
            }
            if (!list[i]["keyword2"]) {
                list[i]["keyword2"] = [];
            }
            list[i]["keyword1"] = extractSynonymIndex(list[i]["keyword1"]);
            list[i]["keyword2"] = extractSynonymIndex(list[i]["keyword2"]);
        }
        articles.list = list;
    });
    Vue.component("search-articles", {
        //props: ["query"],
        data: function () {
            return {
                articles: articles,
                query: "",
            };
        },
        computed: {
            result: function () { return searchArticles(this.query, this.articles.list); },
        },
        template: `
          <div>
            <!-- input v-model="query" placeholder="Search articles" -->
            <h1 v-if="result.title1">{{ result.title1 }} ({{ result.count }}件)</h1>
            <ul v-if="result.articles1.length > 0">
              <li v-for="article in result.articles1">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> ({{ article.date }})
              </li>
            </ul>
            <h2 v-if="result.title2">{{ result.title2 }}</h2>
            <ul v-if="result.articles2.length > 0" class="font-small">
              <li v-for="article in result.articles2">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> ({{ article.date }})
              </li>
            </ul>
          </div>
        `,
    });
    Vue.component("search-articles-fixed", {
        props: ["query"],
        data: function () {
            return {
                articles: articles,
            };
        },
        computed: {
            result: function () { return searchArticles(this.query, this.articles.list); },
            imageHtml: function () { return getImageHtml(this.query); },
        },
        template: `
          <div>
            <h1 v-if="result.title1">{{ result.title1 }} ({{ result.count }}件)</h1>
            <ul v-if="result.articles1.length > 0">
              <li v-for="article in result.articles1">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> ({{ article.date }})
              </li>
            </ul>
            <div v-html="imageHtml"></div>
            <h2 v-if="result.title2">{{ result.title2 }}</h2>
            <ul v-if="result.articles2.length > 0" class="font-small">
              <li v-for="article in result.articles2">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> ({{ article.date }})
              </li>
            </ul>
          </div>
        `,
    });
    Vue.component("articles-count", {
        props: ["query"],
        data: function () {
            return {
                articles: articles,
            };
        },
        computed: {
            result: function () { return searchArticles(this.query, this.articles.list); },
        },
        template: `
          <span>{{ result.count }}</span>
        `,
    });

    new Vue({ el: "#body" })
});
