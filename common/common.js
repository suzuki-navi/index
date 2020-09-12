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
        } else if (keywd == "jq") {
            result = articles.filter( article => {
                let ex = "jquery";
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
            const recent_count = 40;
            if (articles.length <= recent_count) {
                result2 = articles;
            } else {
                result2 = articles.slice(0, recent_count);
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
        case "#certification":
            title1 = "これまでに取得した資格";
            break;
        case "#count":
            title1 = "これまでに書いた記事数";
            break;
        case "#my_open_sources":
            title1 = "オープンソースで作っているもの";
            break;
        case "#my_cases":
            title1 = "これまでに携わった主な公開事例";
            break;

        }
        if (result2.length == 0) {
            title2 = "";
        } else if (result1.length == 0 && getImageHtml(query)[0] == "") {
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
            return ['<p class="image"><a href="https://qiita.com/suzuki-navi/items/2581b3f4afeeabeacace"><img src="ml.png"></a></p>', ''];
        case "raspberry_pi":
            return ['<p class="youtube"><iframe width="352" height="198" src="https://www.youtube-nocookie.com/embed/wFTvOIsHmQo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>', ''];
        case "command":
            return ['<p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>', ''];
        case "git":
            return ['<p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>', ''];
        case "#math":
            return ['<p class="image"><a href="https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/"><img src="math.png"></a></p>', ''];
        case "#pickup":
            return [
                '<p class="youtube"><iframe width="352" height="198" src="https://www.youtube-nocookie.com/embed/wFTvOIsHmQo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>' +
                '<p class="image"><a href="https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/"><img src="math.png"></a></p>',
                ''];
        default:
            return ['', ''];
        }
    }
    function getCountStr(query, searchResult) {
        if (query == "") {
            return "";
        } else if (query == "#count") {
            return "";
        } else if (query == "#certification") {
            return "";
        } else if (query == "#my_open_sources") {
            return "";
        } else if (query == "#my_cases") {
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
            let entry = list[i];
            if (entry["updated"] == "") {
                entry["date"] = entry["posted"];
            } else {
                entry["date"] = entry["posted"] + "投稿 " + entry["updated"] + "更新";
            }
            if (!entry["keyword2"]) {
                entry["keyword2"] = [];
            }
            entry["keyword1"] = entry["keyword1"].filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            entry["keyword2"] = entry["keyword2"].filter(function (x, i, self) {
                return entry["keyword1"].indexOf(x) < 0 && self.indexOf(x) === i;
            });
            entry["keyword1"].concat(entry["keyword2"]).forEach(function (k) {
                if (!(k in tags)) {
                    tags[k] = 0;
                }
                tags[k]++;
            });
            entry["keyword1"] = extractSynonymIndex(entry["keyword1"]);
            entry["keyword2"] = extractSynonymIndex(entry["keyword2"]);
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
            "thema2": [
                ["#pickup", 0, "主な記事"],
                ["#certification", 0, "取得した資格"],
                ["#count", 0, "書いた記事数"],
                ["#my_open_sources", 0, "作っているもの"],
                ["#my_cases", 0, "主な公開事例"],
            ],
            "cloud_gcp": [
                ["gcp", 0, "GCP"],
                ["bigquery", 0, "BigQuery"],
                ["cloudsql", 0, "Cloud SQL"],
                ["computeengine", 0, "Compute Engine"],
                ["gcs", 0, "Cloud Storage"],
                ["cloudtranslation", 0, "Cloud Translation"],
                ["gsutil", 0, "gsutil"],
                ["bq", 0, "bq"],
            ],
            "cloud_aws": [
                ["aws", 0, "AWS"],
                ["s3", 0, "S3"],
                ["rds", 0, "RDS"],
                ["aurora", 0, "Aurora"],
                ["redshift", 0, "Redshift"],
                ["glue", 0, "Glue"],
                ["documentdb", 0, "DocumentDB"],
                ["lambda", 0, "Lambda"],
                ["apigateway", 0, "API Gateway"],
                ["alb", 0, "ALB"],
                ["cognito", 0, "Cognito"],
                ["cloudformation", 0, "CloudFormation"],
                ["comprehend", 0, "Comprehend"],
                ["cloudwatch", 0, "CloudWatch"],
                ["cloudtrail", 0, "CloudTrail"],
                ["awscli", 0, "awscli"],
            ],
            "lang": [
                ["scala", 0, "Scala"],
                ["java", 0, "Java"],
                ["php", 0, "PHP"],
                ["perl", 0, "Perl"],
                ["python", 0, "Python"],
                ["ruby", 0, "Ruby"],
                ["javascript", 0, "JavaScript"],
                ["powershell", 0, "PowerShell"],
            ],
            "software": [
                ["postgresql", 0, "PostgreSQL"],
                ["fluentd", 0, "Fluentd"],
                ["elasticsearch", 0, "Elasticsearch"],
                ["kibana", 0, "Kibana"],
                ["metabase", 0, "Metabase"],
                ["redash", 0, "Redash"],
                ["superset", 0, "Superset"],
                ["tableau", 0, "Tableau"],
                ["jupyter", 0, "Jupyter Notebook"],
                ["polynote", 0, "Polynote"],
                ["talend", 0, "Talend"],
                ["dbeaver", 0, "DBeaver"],
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
                ["vipe", 0],
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
                ["#naviplus", 0],
                ["#beex", 0],
                ["#business_blog", 0],
                ["#qiita", 0],
                ["#hatenablog", 0],
                ["#pickup", 0],
            ],
            "other": [
                ["#lang_compare", 0, "プログラミング言語比較"],
                ["#natural_language_processing", 0, "自然言語処理"],
                ["#numerical_analysis", 0, "数値計算"],
                ["#probability_distribution", 0, "確率分布"],
                ["#gradient_descent", 0, "勾配降下法"],
                ["#network", 0, "ネットワーク"],
                ["raspberry_pi", 0, "Raspberry Pi"],
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
            //if (f && tags[i][0].indexOf("#") != 0) {
            if (f) {
                ret["other"].push(tags[i]);
            }
        }
        for (let [k, ts] of Object.entries(ret)) {
            for (let j = 0; j < ts.length; j++) {
                if (ts[j].length == 2) {
                    ts[j].push(ts[j][0]);
                }
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
            imageHtml1: function () { return getImageHtml(this.query)[0]; },
            imageHtml2: function () { return getImageHtml(this.query)[1]; },
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
            <div v-html="imageHtml1"></div>
            <h2 v-if="result.title2">{{ result.title2 }}</h2>
            <ul v-if="result.articles2.length > 0" class="font-small">
              <li v-for="article in result.articles2">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> ({{ article.date }})
              </li>
            </ul>
            <div v-html="imageHtml2"></div>
            <section v-if="global_query.query=='#certification'">
              <ul>
                <li>日本ディープラーニング協会 G検定 (2020/07/04) <a href="https://qiita.com/suzuki-navi/items/fd3607f8f0e670bba887">合格体験記事</a></li>
                <li>日本統計学会 統計検定 2級 (2020/05/31) <a href="https://qiita.com/suzuki-navi/items/e353b8dfbc6e872f9f41">合格体験記事</a></li>
                <li>AWS Certified Machine Learning - Specialty (2019/11/20) <a href="https://qiita.com/suzuki-navi/items/3664bfbc102052717426">合格体験記事</a></li>
                <li>AWS Certified Big Data - Specialty (2019/10/31) <a href="https://qiita.com/suzuki-navi/items/8b2fe5a35a4439013461">合格体験記事</a></li>
                <li>AWS Certified Solutions Architect - Associate (2019/09/26)</li>
                <li>全国珠算教育連盟 珠算検定 初段 (昔)</li>
                <li>日本商工会議所 珠算検定 1級 (昔)</li>
              </ul>
              <p class="image">
                <img src="certification.png">
              </p>
              <p class="image">
                <img src="toukei-kentei.png">
              </p>
            </section>
            <section v-if="global_query.query=='#count'">
              <table>
                <tr>
                  <td>会社ブログ(現職+前職)：</td>
                  <td><articles-count query="#business_blog"></articles-count></td>
                </tr>
                <tr>
                  <td><a href="https://qiita.com/suzuki-navi">Qiita</a>：</td>
                  <td><articles-count query="#qiita"></articles-count></td>
                </tr>
                <tr>
                  <td><a href="https://suzuki-navi.hatenablog.com/">はてなブログ</a>：</td>
                  <td><articles-count query="#hatenablog"></articles-count></td>
                </tr>
              </table>
              <p class="font-small">
                ※このインデックスページには記事を重複ありで分類しています。
              </p>
            </section>
            <section v-if="global_query.query=='#my_open_sources'">
              <ul>
                <li><a href="https://github.com/xsvutils/xsvutils">xsvutils (2017/12 〜)</a>
                  <p>CSVファイルやTSVファイルをCUIで扱うツール。</p>
                </li>
              </ul>
            </section>
            <section v-if="global_query.query=='#my_cases'">
              <ul>
                <li><a href="https://www.naviplus.co.jp/search/">ECサイトの検索エンジン</a> (2013/05 〜 2019/07)
                  <p>多数のECサイトの検索エンジン開発/導入/運用に携わる</p>
                  <ul>
                    <li><a href="https://www.naviplus.co.jp/showcase/interview/surugaya">主な導入事例</a></li>
                  </ul>
                </li>
              </ul>
              <p class="image">
                <img src="search-2.png">
              </p>
            </section>
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
            imageHtml: function () { return getImageHtml(this.query)[0]; },
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
                $("#drawer-check").prop("checked", false);
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            },
        },
        template: `
          <div>
            <div class="drawer-menu-1">
              <div v-for="(tag, idx) in categorized.thema">
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}({{ tag[1] }})</a>
              </div>
              <div v-for="(tag, idx) in categorized.thema2">
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}</a>
              </div>
            </div>
            <h2>クラウド環境記事 - GCP</h2>
            <div>
              <span v-for="(tag, idx) in categorized.cloud_gcp">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>クラウド環境記事 - AWS</h2>
            <div>
              <span v-for="(tag, idx) in categorized.cloud_aws">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>プログラミング言語別記事</h2>
            <div>
              <span v-for="(tag, idx) in categorized.lang">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>ソフトウェア別記事</h2>
            <div>
              <span v-for="(tag, idx) in categorized.software">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>Linuxコマンドの記事</h2>
            <div>
              <span v-for="(tag, idx) in categorized.command">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <h2>その他</h2>
            <div>
              <span v-for="(tag, idx) in categorized.other">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
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
