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

        case "command":
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

        case "#pickup":
            title1 = "主な記事";
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
        case "command":
            return '<p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>';
        case "git":
            return '<p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>';
        case "#math":
            return '<p class="image"><a href="https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/"><img src="math.png"></a></p>';
        case "#pickup":
            return '' +
                '<p class="youtube"><iframe width="352" height="198" src="https://www.youtube-nocookie.com/embed/wFTvOIsHmQo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>' +
                '<p class="image"><a href="https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/"><img src="math.png"></a></p>';
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
            }
            if (k.indexOf('_') >= 0) {
                keywds.push(k.replace('_', ''));
            }
        }
        return keywds;
    }
    let articles = {
        list: [],
        tags: [],
    };
    let global_query = {
        query: "",
    };
    if (window.location.hash != "") {
        global_query.query = window.location.hash.substring(1);
    }
    window.onpopstate = function(event) {
        global_query.query = window.location.hash.substring(1);
    };
    axios.get(articles_json_url).then(response => {
        let list = response.data;
        let tags = {};
        for (let i = 0; i < list.length; i++) {
            if (list[i]["updated"] == "") {
                list[i]["date"] = list[i]["posted"];
            } else {
                list[i]["date"] = list[i]["posted"] + "投稿 " + list[i]["updated"] + "更新";
            }
            if (!list[i]["keyword2"]) {
                list[i]["keyword2"] = [];
            }
            list[i]["keyword1"] = list[i]["keyword1"].filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            list[i]["keyword2"] = list[i]["keyword2"].filter(function (x, i, self) {
                return list[i]["keyword1"].indexOf(x) < 0 && self.indexOf(x) === i;
            });
            list[i]["keyword1"].concat(list[i]["keyword2"]).forEach(function (k) {
                if (!(k in tags)) {
                    tags[k] = 0;
                }
                tags[k]++;
            });
            list[i]["keyword1"] = extractSynonymIndex(list[i]["keyword1"]);
            list[i]["keyword2"] = extractSynonymIndex(list[i]["keyword2"]);
        }
        tags = Object.entries(tags);
        tags.sort(function(a, b) {
            if (a[1] > b[1]) {
                return -1;
            } else if (a[1] < b[1]) {
                return +1;
            } else {
                return 0;
            }
        });
        articles.list = list;
        articles.tags = tags;
    });
    function categorizeTags(tags) {
        let ret = {
            "thema": [
                ["#machine_learning", 0, "機械学習の記事"],
                ["#statistics", 0, "統計の記事"],
                ["#visualization", 0, "データ可視化の記事"],
                ["#data_store", 0, "データ保管の記事"],
                ["#data_input", 0, "データ収集の記事"],
                ["#math", 0, "数式のある記事"],
            ],
            "lang": [
                ["scala", 0],
                ["java", 0],
                ["php", 0],
                ["perl", 0],
                ["python", 0],
                ["ruby", 0],
                ["javascript", 0],
                ["powershell", 0],
            ],
            "cloud_gcp": [
                ["gcp", 0],
                ["bigquery", 0],
                ["cloud_sql", 0],
                ["compute_engine", 0],
                ["gcs", 0],
                ["cloudtranslation", 0],
                ["gsutil", 0],
                ["bq", 0],
            ],
            "cloud_aws": [
                ["aws", 0],
                ["s3", 0],
                ["glue", 0],
                ["documentdb", 0],
                ["rds", 0],
                ["aurora", 0],
                ["lambda", 0],
                ["api_gateway", 0],
                ["alb", 0],
                ["cognito", 0],
                ["cloudformation", 0],
                ["comprehend", 0],
                ["awscli", 0],
            ],
            "software": [
                ["postgresql", 0],
                ["fluentd", 0],
                ["elasticsearch", 0],
                ["kibana", 0],
                ["metabase", 0],
            ],
            "command": [
                ["command", 0],
                ["git", 0],
                ["diff", 0],
                ["jq", 0],
                ["xargs", 0],
                ["seq", 0],
                ["printf", 0],
                ["date", 0],
                ["find", 0],
                ["rm", 0],
                ["column", 0],
                ["uname", 0],
                ["unzip", 0],
                ["7z", 0],
                ["du", 0],
                ["pv", 0],
                ["pwsh", 0],
                ["gsutil", 0],
                ["bq", 0],
                ["awscli", 0],
            ],
            "hidden": [
                ["golang", 0],
                ["rust", 0],
                ["clang", 0],
                ["c++", 0],
                ["nlb", 0],
                ["clb", 0],
            ],
            "other": [
                ["#network", 0],
                ["#natural_language_processing", 0],
                ["#lang_compare", 0],
            ],
        };
        for (let i = 0; i < tags.length; i++) {
            let f = true;
            for (let [k, ts] of Object.entries(ret)) {
                for (let j = 0; j < ts.length; j++) {
                    if (ts[j][0] == tags[i][0]) {
                        ts[j][1] = tags[i][1];
                        f = false;
                    }
                }
            }
            if (f && tags[i][0].indexOf("#") != 0) {
                ret["other"].push(tags[i]);
            }
        }
        return ret;
    }
    /*
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
    */
    Vue.component("search-articles-search", {
        data: function () {
            return {
                articles: articles,
                global_query: global_query,
            };
        },
        computed: {
            query: function () { return global_query.query; },
            result: function () { return searchArticles(this.query, this.articles.list); },
            count_str: function () { return getCountStr(this.query, this.result); },
            imageHtml: function () { return getImageHtml(this.query); },
        },
        template: `
          <div>
            <input v-model="global_query.query" placeholder="Search articles">
            <h1 v-if="result.title1">{{ result.title1 }} {{ count_str }}</h1>
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
    Vue.component("articles-tags", {
        data: function () {
            return {
                articles: articles,
                global_query: global_query,
            };
        },
        computed: {
            categorized: function () {
                return categorizeTags(articles.tags);
            }
        },
        methods: {
            gotoTagPage: function (tag) {
                global_query.query = tag;
                history.pushState(undefined, tag + " | suzuki-navi", "#" + tag);
            },
        },
        template: `
          <div>
            <div>
              <div v-for="(tag, idx) in categorized.thema">
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}({{ tag[1] }})</a>
              </div>
            </div>
            <h2>クラウド環境記事 - GCP</h2>
            <div>
              <span v-for="(tag, idx) in categorized.cloud_gcp">
                <span v-if="idx>0"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[0] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>クラウド環境記事 - AWS</h2>
            <div>
              <span v-for="(tag, idx) in categorized.cloud_aws">
                <span v-if="idx>0"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[0] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>プログラミング言語別記事</h2>
            <div>
              <span v-for="(tag, idx) in categorized.lang">
                <span v-if="idx>0"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[0] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>ソフトウェア別記事</h2>
            <div>
              <span v-for="(tag, idx) in categorized.software">
                <span v-if="idx>0"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[0] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>Linuxコマンドの記事</h2>
            <div>
              <span v-for="(tag, idx) in categorized.command">
                <span v-if="idx>0"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[0] }}({{ tag[1] }})</a>
              </span>
            </div>
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
