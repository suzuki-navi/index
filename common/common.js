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
        let result1 = [];
        let result2 = [];
        if (query == "") {
            if (articles.length <= 20) {
                result2 = articles;
            } else {
                result2 = articles.slice(0, 20);
            }
        } else {
            result1 = articles;
            let words = query.split(' ');
            for (let i = 0; i < words.length; i++) {
                let w = words[i];
                result1 = searchByKeyword1(w, result1);
            }
            result2 = articles.filter ( a => {
                return result1.indexOf(a) < 0;
            });
            for (let i = 0; i < words.length; i++) {
                let w = words[i];
                result2 = searchByKeyword2(w, result2);
            }
        }
        let title1 = "\"" + query + "\" の記事";
        let title2 = "\"" + query + "\" の含まれる記事";
        switch (query) {
        case "":
            title2 = "最近の記事";
            break;

        case "#machine_learning":
            title1 = "機械学習 - データ活用フェーズの記事";
            break;
        case "#statistics":
            title1 = "統計 - データ活用フェーズの記事";
            break;
        case "#visualization":
            title1 = "可視化 - データ活用フェーズの記事";
            break;
        case "#data_input":
            title1 = "データ収集フェーズの記事";
            break;
        case "#data_store":
            title1 = "データ保管フェーズの記事";
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
        case "#jupyter_matplotlib":
            title1 = "Jupyter Notebook/Pandas/matplotlib - ソフトウェア別記事";
            title2 = "Jupyter Notebook/Pandas/matplotlibも使用している記事";
            break;
        case "#network":
            title1 = "ネットワークの記事";
            break;
        case "#math":
            title1 = "数式が多めの記事";
            title2 = "数式が少し";
            break;

        case "aws":
            title1 = "AWSに関する記事";
            break;
        case "gcp":
            title1 = "GCPに関する記事";
            break;
        case "aws_gcp":
            title1 = "AWS/GCP関係の記事";
            break;

        case "scala":
            title1 = "Scala - 言語別記事";
            title2 = "Scalaも登場する記事";
            break;
        case "java":
            title1 = "Java - 言語別記事";
            title2 = "Javaも登場する記事";
            break;
        case "php":
            title1 = "PHP - 言語別記事";
            title2 = "PHPも登場する記事";
            break;
        case "perl":
            title1 = "Perl - 言語別記事";
            title2 = "Perlも登場する記事";
            break;
        case "python":
            title1 = "Python - 言語別記事";
            title2 = "Pythonも登場する記事";
            break;
        case "ruby":
            title1 = "Ruby - 言語別記事";
            title2 = "Rubyも登場する記事";
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
        case "raspberry_pi":
            title1 = "Raspberry Piの記事";
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
        } else if (result1.length == 0 && getImageHtml(query) == "") {
            title1 = title2;
            title2 = "";
        }
        let count = result1.length + result2.length;
        return {
            "title1": title1,
            "articles1": result1,
            "title2": title2,
            "articles2": result2,
            "count": count,
        };
    }
    function getImageHtml(query) {
        query = normalizeQuery(query);
        switch(query) {
        case "#machine_learning":
            return '<p class="image"><a href="https://qiita.com/suzuki-navi/items/2581b3f4afeeabeacace"><img src="ml.png"></a></p>';
        case "php":
            return '<p class="font-small">もっとも古くから触っていた言語の1つですが記事はあまりありません。</p>';
        case "raspberry_pi":
            return '<p class="youtube"><iframe width="352" height="198" src="https://www.youtube-nocookie.com/embed/wFTvOIsHmQo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>';
        case "#linux_commands":
            return '<p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>';
        case "#math":
            return '<p class="image"><img src="math.png"></p>';
        default:
            return '';
        }
    }
    function getCountStr(query, searchResult) {
        if (query == "") {
            return "";
        } else {
            return "( " + searchResult.count + "件 )";
        }
    }
    function extractSynonymIndex(keywds) {
        let len = keywds.length;
        for (let i = 0; i < len; i++) {
            let k = keywds[i];
            switch(k) {
            case "javascript":
                keywds.push("js");
                break;
            case "vuejs":
                keywds.push("vue.js");
                break;
            case "#machine_learning":
                keywds.push("ml");
                break;
            case "#natural_language_processing":
                keywds.push("nlp");
                break;
            case "aws":
                keywds.push("aws_gcp");
                break;
            case "gcp":
                keywds.push("aws_gcp");
                break;
            }
            if (k.indexOf('_') >= 0) {
                keywds.push(k.replace('_', ''));
            }
        }
        return keywds;
    }
    let articles = {
        list: [],
    };
    axios.get(articles_json_url).then(response => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
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
        data: function () {
            return {
                articles: articles,
                query: "",
            };
        },
        computed: {
            result: function () { return searchArticles(this.query, this.articles.list); },
            count_str: function () { return getCountStr(this.query, this.result); },
        },
        template: `
          <div>
            <!-- input v-model="query" placeholder="Search articles" -->
            <h1 v-if="result.title1">{{ result.title1 }} {{ count_str }}</h1>
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
    Vue.component("search-articles-search", {
        data: function () {
            return {
                articles: articles,
                query: "",
            };
        },
        computed: {
            result: function () { return searchArticles(this.query, this.articles.list); },
            count_str: function () { return getCountStr(this.query, this.result); },
        },
        template: `
          <div>
            <input v-model="query" placeholder="Search articles">
            <h1 v-if="result.title1">{{ result.title1 }} {{ count_str }}</h1>
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
