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

    function searchByKeyword(keywd, articles) {
        let result = [];
        for (let i in articles) {
            let article = articles[i];
            var score = 0;
            if (keywd == "") {
                score = 1;
            } else if (article.keyword1.find(k => k == keywd)) {
                score = 2;
                if (article.keyword1.find(k => k == "#pickup")) {
                    score = 3;
                }
            } else {
                if (keywd == "java") {
                    let ex = "javascript";
                    if (article.keyword1.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                        article.keyword2.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                        article.title.toLowerCase().indexOf(keywd) >= 0 && article.title.toLowerCase().indexOf(ex) < 0) {
                        score = 1;
                    }
                } else if (keywd == "jq") {
                    let ex = "jquery";
                    if (article.keyword1.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                        article.keyword2.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                        article.title.toLowerCase().indexOf(keywd) >= 0 && article.title.toLowerCase().indexOf(ex) < 0) {
                        score = 1;
                    }
                } else {
                    if (article.keyword1.find(k => k.startsWith(keywd)) ||
                        article.keyword2.find(k => k.startsWith(keywd)) ||
                        article.title.toLowerCase().indexOf(keywd) >= 0) {
                        score = 1;
                    }
                }
            }
            if (score > 0) {
                let liststyle = (score >= 3)? "★" : (score >= 2)? "\\2714" : "・";
                let article2 = {
                    "score": score,
                    "liststyle": "list-style-type:\"" + liststyle + "\"",
                    "title": article.title,
                    "date": article["date"],
                    "url": article["url"],
                };
                result.push(article2);
            }
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
        if (query == "") {
            const recent_count = 20;
            if (articles.length <= recent_count) {
                result1 = articles;
            } else {
                result1 = articles.slice(0, recent_count);
            }
            result1 = searchByKeyword("", result1);
        } else {
            result1 = articles;
            let words = query.split(' ');
            for (let i = 0; i < words.length; i++) {
                let w = words[i];
                result1 = searchByKeyword(w, result1);
            }
        }
        let title1 = "\"" + query + "\" の記事";
        switch (query) {
        case "":
            title1 = "最近の記事";
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
        case "#programming":
            title1 = "プログラミングの記事";
            break;
        case "#network":
            title1 = "ネットワークの記事";
            break;
        case "#math":
            title1 = "数式のある記事";
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
            break;
        case "java":
            title1 = "Java - 言語別記事";
            break;
        case "php":
            title1 = "PHP - 言語別記事";
            break;
        case "perl":
            title1 = "Perl - 言語別記事";
            break;
        case "python":
            title1 = "Python - 言語別記事";
            break;
        case "ruby":
            title1 = "Ruby - 言語別記事";
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
        let count = result1.length;
        return {
            "title1": title1,
            "articles1": result1,
            "count": count,
        };
    }
    function getCountStr(query, searchResult) {
        if (query == "") {
            return "";
        } else if (query == "#tags") {
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
    function keywordDatabase() {
        return  [
            {tag: "#machine_learning", categories: [["thema", "機械学習の記事"]]},
            {tag: "#statistics",       categories: [["thema", "統計の記事"]]},
            {tag: "#visualization",    categories: [["thema", "データ可視化の記事"]]},
            {tag: "#data_store",       categories: [["thema", "データ保管の記事"]]},
            {tag: "#data_input",       categories: [["thema", "データ収集の記事"]]},
            {tag: "#math",             categories: [["thema", "数式のある記事"]]},

            {tag: "#certification",    categories: [["thema2", "取得した資格"]]},
            {tag: "#count",            categories: [["thema2", "書いた記事数"]]},
            {tag: "#my_open_sources",  categories: [["thema2", "作っているもの"]]},
            {tag: "#my_cases",         categories: [["thema2", "主な公開事例"]]},

            {tag: "gcp",               categories: [["cloud_gcp", "GCP"]]},
            {tag: "bigquery",          categories: [["cloud_gcp", "BigQuery"]]},
            {tag: "cloudsql",          categories: [["cloud_gcp", "Cloud SQL"]]},
            {tag: "computeengine",     categories: [["cloud_gcp", "Compute Engine"]]},
            {tag: "gcs",               categories: [["cloud_gcp", "Cloud Storage"]]},
            {tag: "dataflow",          categories: [["cloud_gcp", "Dataflow"]]},
            {tag: "cloudtranslation",  categories: [["cloud_gcp", "Cloud Translation"]]},

            {tag: "aws", categories: [["cloud_aws", "AWS"]]},
            {tag: "s3", categories: [["cloud_aws", "S3"]]},
            {tag: "rds", categories: [["cloud_aws", "RDS"]]},
            {tag: "aurora", categories: [["cloud_aws", "Aurora"]]},
            {tag: "redshift", categories: [["cloud_aws", "Redshift"]]},
            {tag: "glue", categories: [["cloud_aws", "Glue"]]},
            {tag: "documentdb", categories: [["cloud_aws", "DocumentDB"]]},
            {tag: "lambda", categories: [["cloud_aws", "Lambda"]]},
            {tag: "apigateway", categories: [["cloud_aws", "API Gateway"]]},
            {tag: "alb", categories: [["cloud_aws", "ALB"]]},
            {tag: "cognito", categories: [["cloud_aws", "Cognito"]]},
            {tag: "cloudformation", categories: [["cloud_aws", "CloudFormation"]]},
            {tag: "comprehend", categories: [["cloud_aws", "Comprehend"]]},
            {tag: "cloudwatch", categories: [["cloud_aws", "CloudWatch"]]},
            {tag: "cloudtrail", categories: [["cloud_aws", "CloudTrail"]]},

            {tag: "scala",      categories: [["lang", "Scala"]]},
            {tag: "java",       categories: [["lang", "Java"]]},
            {tag: "c#",         categories: [["lang", "C#"]]},
            {tag: "c++",        categories: [["lang", "C++"]]},
            {tag: "clang",      categories: [["lang", "C言語"]], desc: "私にとって始めてさわったプログラミング言語"},
            {tag: "golang",     categories: [["lang", "Go言語"]]},
            {tag: "rust",       categories: [["lang", "Rust"]]},
            {tag: "php",        categories: [["lang", "PHP"]]},
            {tag: "perl",       categories: [["lang", "Perl"]]},
            {tag: "python",     categories: [["lang", "Python"]]},
            {tag: "ruby",       categories: [["lang", "Ruby"]]},
            {tag: "javascript", categories: [["lang", "JavaScript"]]},
            {tag: "elixir",     categories: [["lang", "Elixir"]]},
            {tag: "powershell", categories: [["lang", "PowerShell"]]},

            {tag: "postgresql", categories: [["software", "PostgreSQL"]]},
            {tag: "fluentd", categories: [["software", "Fluentd"]]},
            {tag: "elasticsearch", categories: [["software", "Elasticsearch"]]},
            {tag: "kibana", categories: [["software", "Kibana"]]},
            {tag: "metabase", categories: [["software", "Metabase"]]},
            {tag: "redash", categories: [["software", "Redash"]]},
            {tag: "superset", categories: [["software", "Superset"]]},
            {tag: "tableau", categories: [["software", "Tableau"]]},
            {tag: "jupyter", categories: [["software", "Jupyter Notebook"]]},
            {tag: "polynote", categories: [["software", "Polynote"]]},
            {tag: "tensorflow", categories: [["software", "TensorFlow"]]},
            {tag: "matplotlib", categories: [["software", "Matplotlib"]]},
            {tag: "talend", categories: [["software", "Talend"]]},
            {tag: "dbeaver", categories: [["software", "DBeaver"]]},

            {tag: "command", categories: [["command", "Linuxコマンド"]]},
            {tag: "git", categories: [["command", "git"]]},
            {tag: "diff", categories: [["command", "diff"]]},
            {tag: "jq", categories: [["command", "jq"]]},
            {tag: "xargs", categories: [["command", "xargs"]]},
            {tag: "seq", categories: [["command", "seq"]]},
            {tag: "printf", categories: [["command", "printf"]]},
            {tag: "date", categories: [["command", "date"]]},
            {tag: "find", categories: [["command", "find"]]},
            {tag: "rm", categories: [["command", "rm"]]},
            {tag: "column", categories: [["command", "column"]]},
            {tag: "uname", categories: [["command", "uname"]]},
            {tag: "unzip", categories: [["command", "unzip"]]},
            {tag: "7z", categories: [["command", "7z"]]},
            {tag: "du", categories: [["command", "du"]]},
            {tag: "pv", categories: [["command", "pv"]]},
            {tag: "vipe", categories: [["command", "vipe"]]},
            {tag: "grep", categories: [["command", "grep"]]},
            {tag: "sed", categories: [["command", "sed"]]},
            {tag: "arp", categories: [["command", "arp"]]},
            {tag: "pwsh", categories: [["command", "pwsh"]]},
            {tag: "gsutil",  categories: [["command", "gsutil"], ["cloud_gcp", "gsutil"]]},
            {tag: "bq",      categories: [["command", "bq"],     ["cloud_gcp", "bq"]]},
            {tag: "awscli",  categories: [["command", "aws"],    ["cloud_aws", "awscli"]]},

            {tag: "#naviplus", categories: [["hidden", ""]]},
            {tag: "#beex", categories: [["hidden", ""]]},
            {tag: "#business_blog", categories: [["hidden", ""]]},
            {tag: "#qiita", categories: [["hidden", ""]]},
            {tag: "#hatenablog", categories: [["hidden", ""]]},
            {tag: "#github_markdown", categories: [["hidden", ""]]},
            {tag: "#pickup", categories: [["hidden", ""]]},
            {tag: "#natural_language_processing", categories: [["hidden", "自然言語処理"]]},

            {tag: "#programming", categories: [["other", "プログラミング"]]},
            {tag: "raspberry_pi", categories: [["other", "Raspberry Pi"]]},
            {tag: "#numerical_analysis", categories: [["other_more", "数値計算"]]},
            {tag: "#probability_distribution", categories: [["other_more", "確率分布"]]},
            {tag: "#gradient_descent", categories: [["other_more", "勾配降下法"]]},
            {tag: "#network", categories: [["other_more", "ネットワーク"]]},
            {tag: "googlecolab", categories: [["other_more", "Google Colaboratory"]]},
        ];
    }
    function keywordDatabaseByTag(tag) {
        let arr = keywordDatabase();
        let map = {};
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].tag == tag) {
                return arr[i];
            }
        }
        return undefined;
    }
    function categorizeTags(tags) {
        let keywordDb = keywordDatabase();
        let ret = [];
        ret["other_more"] = [];
        for (let i = 0; i < keywordDb.length; i++) {
            let keywordRecord = keywordDb[i];
            for (let j = 0; j < keywordRecord.categories.length; j++) {
                if (!(keywordRecord.categories[j][0] in ret)) {
                    ret[keywordRecord.categories[j][0]] = [];
                }
                ret[keywordRecord.categories[j][0]].push([keywordRecord.tag, 0, keywordRecord.categories[j][1]]);
            }
        }
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
            if (f) {
                ret["other_more"].push(tags[i]);
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
    function descFromTag(tag) {
        let keywordDb = keywordDatabaseByTag(tag);
        if (keywordDb) {
            return keywordDb.desc;
        } else {
            return "";
        }
    }
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
            desc: function () { return descFromTag(this.query); },
            categorized: function () {
                return categorizeTags(articles.tags);
            }
        },
        template: `
          <div>
            <div id="card-tags-label-open-wrapper"><label for="card-tags-checkbox" id="card-tags-label-open">[tags...]</label></div>
            <input v-model="global_query.query" placeholder="Search articles">
            <h1 v-if="result.title1">{{ result.title1 }} {{ count_str }}</h1>
            <p v-if="desc">{{ desc }}</p>
            <ul v-if="result.articles1.length > 0">
              <li v-for="article in result.articles1" v-bind:style="article.liststyle">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> ({{ article.date }})
              </li>
            </ul>
            <section v-if="global_query.query=='#machine_learning'">
              <p class="image"><a href="https://qiita.com/suzuki-navi/items/2581b3f4afeeabeacace"><img src="ml.png"></a></p>
            </section>
            <section v-if="global_query.query=='#math'">
              <p class="image"><a href="https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/"><img src="math.png"></a></p>
            </section>
            <section v-if="global_query.query=='command'">
              <p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>
            </section>
            <section v-if="global_query.query=='git'">
              <p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>
            </section>
            <section v-if="global_query.query=='raspberry_pi'">
              <p class="youtube"><iframe width="352" height="198" src="https://www.youtube-nocookie.com/embed/wFTvOIsHmQo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>
            </section>
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
            <section v-if="global_query.query=='#tags'">
              <div id="card-tags-label-close-wrapper"><label for="card-tags-checkbox" id="card-tags-label-close">[close tags]</label></div>
              <div>
                <span v-for="(tag, idx) in categorized.thema">
                  <span v-if="idx>0" class="font-small"> / </span>
                  <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}({{ tag[1] }})</a>
                </span>
              </div>
            </section>
            <section v-if="global_query.query==''">
              <p class="image">
                <a href="https://github.com/suzuki-navi"><img src="https://grass-graph.moshimo.works/images/suzuki-navi.png?width=610"></a>
              </p>
            </section>
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
                if (tag == "") {
                    history.pushState(undefined, tag + " | suzuki-navi", "./");
                } else {
                    history.pushState(undefined, tag + " | suzuki-navi", "./#" + tag);
                }
                $("#card-tags-checkbox").prop("checked", false);
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            },
        },
        template: `
          <div>
            <div id="card-tags-label-close-wrapper"><label for="card-tags-checkbox" id="card-tags-label-close">[close tags]</label></div>
            <div>
              <span v-for="(tag, idx) in categorized.thema">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <div>
              <h2>クラウド環境記事 - GCP</h2>
              <span v-for="(tag, idx) in categorized.cloud_gcp">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <div>
              <h2>クラウド環境記事 - AWS</h2>
              <span v-for="(tag, idx) in categorized.cloud_aws">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <div>
              <h2>プログラミング言語別記事</h2>
              <span v-for="(tag, idx) in categorized.lang">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <div>
              <h2>ソフトウェア別記事</h2>
              <span v-for="(tag, idx) in categorized.software">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <div>
              <h2>Linuxコマンドの記事</h2>
              <span v-for="(tag, idx) in categorized.command">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
            </div>
            <div>
              <h2>その他</h2>
              <div>
              <span v-for="(tag, idx) in categorized.thema2">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}</a>
              </span>
              </div>
              <div style="margin-top:16px;">
              <span v-for="(tag, idx) in categorized.other">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
              <input type="checkbox" id="othertags-checkbox">
              <label for="othertags-checkbox" id="othertags-label">more...</label>
              <span id="othertags">
              <span v-for="(tag, idx) in categorized.other_more">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<3)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
              </span>
              </div>
            </div>
            <p>
              <a href="" v-on:click.prevent.stop="gotoTagPage('');">top</a>
            </p>
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
