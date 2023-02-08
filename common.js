window.addEventListener("load", (event) => {

    const articleRetriever = [];
    axios.get(articles_json_url).then(response => {
        let list = response.data;
        let list2 = [];
        let tags = {};
        for (let i = 0; i < list.length; i++) {
            let entry = list[i];

            if (entry["posted"] == "") {
                if (entry["updated"] == "") {
                    entry["date"] = "";
                } else {
                    entry["date"] = entry["updated"] + "更新";
                }
            } else {
                if (entry["updated"] == "") {
                    entry["date"] = entry["posted"];
                } else {
                    entry["date"] = entry["posted"] + "投稿 " + entry["updated"] + "更新";
                }
            }

            if (!entry["keyword2"]) {
                entry["keyword2"] = [];
            }
            if (!entry["keyword3"]) {
                entry["keyword3"] = [];
            }

            if (entry["url"].startsWith("https://tech.naviplus.co.jp/")) {
                entry["keyword1"].push("#company_blog");
                entry["keyword3"].push("naviplus");
            } else if (entry["url"].startsWith("https://www.beex-inc.com/blog/")) {
                entry["keyword1"].push("#company_blog");
                entry["keyword3"].push("beex");
            } else if (entry["url"].startsWith("https://qiita.com/")) {
                entry["keyword2"].push("#qiita");
            } else if (entry["url"].startsWith("https://dev.to/")) {
                entry["keyword1"].push("#devto");
            } else if (entry["url"].startsWith("https://suzuki-navi.hatenablog.com/")) {
                entry["keyword2"].push("#hatenablog");
            } else if (entry["url"].startsWith("https://www.youtube.com/")) {
                entry["keyword1"].push("#youtube");
            }

            entry["keyword1"] = entry["keyword1"].filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            entry["keyword2"] = entry["keyword2"].filter(function (x, i, self) {
                return entry["keyword1"].indexOf(x) < 0 && self.indexOf(x) === i;
            });
            entry["keyword1"].concat(entry["keyword2"]).forEach(function (k) {
                if (entry["posted"] != "") {
                    if (!(k in tags)) {
                        tags[k] = 0;
                    }
                    tags[k]++;
                }
            });

            entry["tags"] = [...entry["keyword1"], ...entry["keyword2"]];
            entry["keyword1"] = extractSynonymIndex(entry["keyword1"]);
            entry["keyword2"] = extractSynonymIndex(entry["keyword2"]);

            // keyword3はタグに入れないけど検索キーワード
            for (const kw of entry["keyword3"]) {
                entry["keyword2"].push(kw.toLowerCase());
            }

            list2.push(entry);
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
        for (const retriever of articleRetriever) {
            retriever(list2, tags);
        }
    });

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

    const tagList = new Map();

    tagList.set("#tags", {
        title: "タグ一覧",
        articles: null,
        categories: [],
    });
    tagList.set("#all", {
        title: "すべての記事",
        categories: ["other"],
    });
    tagList.set("#job_history", {
        title: "職歴の概要",
        stitle: "職歴の概要",
        articles: null,
        categories: ["other"],
    });
    tagList.set("#certification", {
        title: "これまでに取得した資格",
        stitle: "取得した資格",
        articles: null,
        categories: ["other"],
    });
    tagList.set("#my_open_sources", {
        title: "オープンソースで作っているもの",
        stitle: "作っているもの",
        articles: null,
        categories: ["other"],
    });
    tagList.set("#mailto", {
        title: "私の連絡先",
        stitle: "連絡先",
        articles: null,
        categories: ["other"],
    });

    tagList.set("scala", {
        title: "Scala - 言語別記事",
        desc: "もっとも気に入っているプログラミング言語",
        categories: ["lang"],
    });
    tagList.set("java", {
        title: "Java - 言語別記事",
        categories: ["lang"],
    });
    tagList.set("rust", {
        stitle: "Rust",
        categories: ["lang"],
    });
    tagList.set("php", {
        title: "PHP - 言語別記事",
        desc: "私にとってもっとも付き合いの長いプログラミング言語",
        categories: ["lang"],
    });
    tagList.set("javascript", {
        title: "JavaScript - 言語別記事",
        categories: ["lang"],
    });
    tagList.set("ruby", {
        title: "Ruby - 言語別記事",
        categories: ["lang"],
    });
    tagList.set("clang", {
        title: "C言語 - 言語別記事",
        desc: "私が始めて触れたプログラミング言語",
        categories: ["lang"],
    });
    tagList.set("c++", {
        title: "C++ - 言語別記事",
        desc: "C言語とともに私が始めて触れたプログラミング言語",
        categories: ["lang"],
    });
    tagList.set("c#", {
        title: "C# - 言語別記事",
        categories: ["lang"],
    });
    tagList.set("perl", {
        title: "Perl - 言語別記事",
        categories: ["lang"],
    });
    tagList.set("golang", {
        stitle: "Go言語",
        categories: ["lang"],
    });
    tagList.set("python", {
        title: "Python - 言語別記事",
        desc: "ここ数年は私がもっともよく使っているプログラミング言語",
        categories: ["lang"],
    });
    tagList.set("elixir", {
        stitle: "Elixir",
        categories: ["lang"],
    });

    tagList.set("serverless_framework", {
        stitle: "Serverless Framework",
        categories: ["software"],
    });
    tagList.set("postgresql", {
        title: "PostgreSQL - ソフトウェア別記事",
        categories: ["software"],
    });
    tagList.set("fluentd", {
        title: "fluentd - ソフトウェア別記事",
        categories: ["software"],
    });
    tagList.set("elasticsearch", {
        title: "Elasticsearch - ソフトウェア別記事",
        categories: ["software"],
    });
    tagList.set("kibana", {
        title: "Kibana - ソフトウェア別記事",
        categories: ["software"],
    });
    tagList.set("metabase", {
        title: "Metabase - ソフトウェア別記事",
        categories: ["software"],
    });
    tagList.set("redash", {
        stitle: "Redash",
        categories: ["software"],
    });
    tagList.set("superset", {
        stitle: "Superset",
        categories: ["software"],
    });
    tagList.set("tableau", {
        stitle: "Tableau",
        categories: ["software"],
    });
    tagList.set("jupyter", {
        stitle: "Jupyter Notebook",
        categories: ["software"],
    });
    tagList.set("polynote", {
        stitle: "Polynote",
        categories: ["software"],
    });
    tagList.set("googlecolab", {
        stitle: "Google Colaboratory",
        categories: ["software"],
    });
    tagList.set("tensorflow", {
        stitle: "TensorFlow",
        categories: ["software"],
    });
    tagList.set("matplotlib", {
        stitle: "Matplotlib",
        categories: ["software"],
    });
    tagList.set("talend", {
        stitle: "Talend",
        categories: ["software"],
    });
    tagList.set("dbeaver", {
        stitle: "DBeaver",
        categories: ["software"],
    });
    tagList.set("embulk", {
        stitle: "Embulk",
        categories: ["software"],
    });
    tagList.set("tex", {
        title: "TeX - ツール別記事",
        stitle: "TeX",
        categories: ["software"],
    });

    tagList.set("aws", {
        title: "AWSに関する記事",
        categories: ["cloud_aws"],
    });
    tagList.set("gcp", {
        title: "Google Cloudに関する記事",
        categories: ["cloud_gcp"],
    });

    tagList.set("command", {
        title: "Linuxコマンドの記事",
        imageLink: "https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82",
        imageUrl: "cli.png",
        categories: ["command"],
    });
    tagList.set("gsutil", {
        stitle: "gsutil",
        categories: ["command", "cloud_gcp"],
    });
    tagList.set("gcloud", {
        stitle: "gcloud",
        categories: ["command", "cloud_gcp"],
    });
    tagList.set("awscli", {
        stitle: "awscli",
        categories: ["command", "cloud_aws"],
    });
    tagList.set("git", {
        stitle: "Git",
        imageLink: "https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82",
        imageUrl: "cli.png",
        categories: ["command", "software"],
    });
    tagList.set("curl", {
        stitle: "curlコマンド",
        categories: ["command"],
    });
    tagList.set("diff", {
        stitle: "diffコマンド",
        categories: ["command"],
    });
    tagList.set("jq", {
        stitle: "jqコマンド",
        categories: ["command"],
    });

    tagList.set("s3", {
        stitle: "S3",
        categories: ["cloud_aws"],
    });
    tagList.set("rds", {
        stitle: "RDS",
        categories: ["cloud_aws"],
    });
    tagList.set("aurora", {
        stitle: "Aurora",
        categories: ["cloud_aws"],
    });
    tagList.set("redshift", {
        stitle: "Redshift",
        categories: ["cloud_aws"],
    });
    tagList.set("dynamodb", {
        stitle: "DynamoDB",
        categories: ["cloud_aws"],
    });
    tagList.set("documentdb", {
        stitle: "DocumentDB",
        categories: ["cloud_aws"],
    });
    tagList.set("lambda", {
        stitle: "Lambda",
        categories: ["cloud_aws"],
    });
    tagList.set("apigateway", {
        stitle: "API Gateway",
        categories: ["cloud_aws"],
    });
    tagList.set("sqs", {
        stitle: "SQS",
        categories: ["cloud_aws"],
    });
    tagList.set("sns_aws", {
        stitle: "SNS",
        categories: ["cloud_aws"],
    });
    tagList.set("stepfunctions", {
        stitle: "Step Functions",
        categories: ["cloud_aws"],
    });
    tagList.set("alb", {
        stitle: "ALB",
        categories: ["cloud_aws"],
    });
    tagList.set("cognito", {
        stitle: "Cognito",
        categories: ["cloud_aws"],
    });
    tagList.set("glue", {
        stitle: "Glue",
        categories: ["cloud_aws"],
    });
    tagList.set("comprehend", {
        stitle: "Comprehend",
        categories: ["cloud_aws"],
    });
    tagList.set("cloudformation", {
        stitle: "CloudFormation",
        categories: ["cloud_aws"],
    });
    tagList.set("cloudwatch", {
        stitle: "CloudWatch",
        categories: ["cloud_aws"],
    });
    tagList.set("cloudtrail", {
        stitle: "CloudTrail",
        categories: ["cloud_aws"],
    });
    tagList.set("ec2", {
        stitle: "EC2",
        categories: ["cloud_aws"],
    });
    tagList.set("dms", {
        stitle: "DMS",
        categories: ["cloud_aws"],
    });
    tagList.set("athena", {
        stitle: "Athena",
        categories: ["cloud_aws"],
    });
    tagList.set("aws_sdk", {
        stitle: "SDK",
        categories: ["cloud_aws"],
    });
    tagList.set("boto3", {
        stitle: "boto3",
        categories: ["cloud_aws"],
    });

    tagList.set("bigquery", {
        stitle: "BigQuery",
        categories: ["cloud_gcp"],
    });
    tagList.set("cloudsql", {
        stitle: "Cloud SQL",
        categories: ["cloud_gcp"],
    });
    tagList.set("gce", {
        stitle: "Compute Engine",
        categories: ["cloud_gcp"],
    });
    tagList.set("gcs", {
        stitle: "Cloud Storage",
        categories: ["cloud_gcp"],
    });
    tagList.set("dataflow", {
        stitle: "Dataflow",
        categories: ["cloud_gcp"],
    });
    tagList.set("cloudtranslation", {
        stitle: "Cloud Translation",
        categories: ["cloud_gcp"],
    });
    tagList.set("cloudfunctions", {
        stitle: "Cloud Functions",
        categories: ["cloud_gcp"],
    });
    tagList.set("firebase", {
        stitle: "Firebase",
        categories: ["cloud_gcp"],
    });
    tagList.set("google_container_registry", {
        stitle: "Container Registry",
        categories: ["cloud_gcp"],
    });
    tagList.set("cloud_deployment_manager", {
        stitle: "Cloud Deployment Manager",
        categories: ["cloud_gcp"],
    });

    tagList.set("#qiita", {
        title: "Qiita - 媒体別記事",
        categories: ["media"],
    });
    tagList.set("#devto", {
        title: "dev.to - 媒体別記事",
        categories: ["media"],
    });
    tagList.set("#hatenablog", {
        title: "はてなブログ - 媒体別記事",
        categories: ["media"],
    });
    tagList.set("#company_blog", {
        title: "勤務先ブログ - 媒体別記事",
        categories: ["media"],
    });
    tagList.set("#youtube", {
        title: "YouTube - 媒体別記事",
        categories: ["media"],
    });

    tagList.set("#programming", {
        title: "プログラミングの記事",
        categories: ["other"],
    });
    tagList.set("atcoder", {
        stitle: "AtCoder",
        imageLink: "https://atcoder.jp/users/suzukinavi",
        imageUrl: "atcoder2.png",
        categories: ["other"],
    });
    tagList.set("#serverless", {
        stitle: "サーバレス開発",
        categories: ["other"],
    });
    tagList.set("#front_end", {
        stitle: "フロントエンド",
        categories: ["other"],
    });
    tagList.set("#math", {
        title: "数式のある記事",
        imageLink: "https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/",
        imageUrl: "math.png",
        categories: ["other"],
    });
    tagList.set("#numerical_analysis", {
        title: "数値計算/シミュレーションの記事",
        categories: ["other"],
    });
    tagList.set("#probability_distribution", {
        stitle: "確率分布",
        categories: ["other"],
    });
    tagList.set("#data_input", {
        title: "データ収集の記事",
        categories: ["other"],
    });
    tagList.set("#data_store", {
        title: "データ保管の記事",
        categories: ["other"],
    });
    tagList.set("#visualization", {
        title: "データ可視化の記事",
        categories: ["other"],
    });
    tagList.set("#statistics", {
        title: "統計の記事",
        categories: ["other"],
    });
    tagList.set("#machine_learning", {
        title: "機械学習の記事",
        imageLink: "https://qiita.com/suzuki-navi/items/2581b3f4afeeabeacace",
        imageUrl: "ml.png",
        categories: ["other"],
    });
    tagList.set("#gradient_descent", {
        stitle: "勾配降下法",
        //categories: ["other"],
    });
    tagList.set("#deep_learning", {
        stitle: "深層学習",
        categories: ["other"],
    });
    tagList.set("#image", {
        stitle: "画像処理",
        categories: ["other"],
    });
    tagList.set("#movie", {
        stitle: "動画処理",
        categories: ["other"],
    });
    tagList.set("#natural_language_processing", {
        title: "自然言語処理の記事",
        categories: ["other"],
    });
    tagList.set("#network", {
        title: "ネットワークの記事",
        categories: ["other"],
    });
    tagList.set("raspberry_pi", {
        title: "Raspberry Piの記事",
        categories: ["other"],
    });
    tagList.set("#piano", {
        stitle: "ピアノ",
        categories: ["other"],
    });
    tagList.set("#astronomy", {
        stitle: "天文計算",
        categories: ["other"],
    });

    function tagListRetriever(tagList, tags) {
        for (const [tag, count] of tags) {
            if (tagList.has(tag)) {
                const info = tagList.get(tag);
                info.count = count;
                tagList.set(tag, info);
            } else {
                tagList.set(tag, {count: count});
            }
        }
    }
    articleRetriever.push(function(articles, tags) {
        tagListRetriever(tagList, tags);
    });

    function getTagsByCategory(category, tagList) {
        const ret = new Map();
        for (const tag of tagList.keys()) {
            const t = tagList.get(tag);
            if (t.categories && category) {
                for (const c of t.categories) {
                    if (c == category) {
                        ret.set(tag, getTagInfo(tag, tagList));
                    }
                }
            } else if (!t.categories && category == null) {
                ret.set(tag, getTagInfo(tag, tagList));
            }
        }
        return ret;
    }

    function getTagInfo(tag, tagList) {
        let t = tagList.get(tag);
        if (!t) {
            t = {
                title: null,
                stitle: null,
                imageLink: null,
                imageUrl: null,
                desc: null,
                articles: [],
            };
        }
        const ret = {};
        if (tag == "") {
            ret.title = "これまでに書いたもの / 作ったもの / してきたこと";
        } else if (t.title) {
            ret.title = t.title;
        } else if (t.stitle) {
            ret.title = t.stitle + "の記事";
        } else {
            ret.title = "\"" + tag + "\" の記事";
        }
        if (t.stitle) {
            ret.stitle = t.stitle;
        } else if (t.title) {
            if (t.title.endsWith("の記事")) {
                ret.stitle = t.title.substring(0, t.title.length - 3);
            } else if (t.title.endsWith("に関する記事")) {
                ret.stitle = t.title.substring(0, t.title.length - 6);
            } else if (t.title.endsWith(" - 言語別記事")) {
                ret.stitle = t.title.substring(0, t.title.length - 8);
            } else if (t.title.endsWith(" - ソフトウェア別記事")) {
                ret.stitle = t.title.substring(0, t.title.length - 12);
            } else if (t.title.endsWith(" - ツール別記事")) {
                ret.stitle = t.title.substring(0, t.title.length - 9);
            } else if (t.title.endsWith(" - 媒体別記事")) {
                ret.stitle = t.title.substring(0, t.title.length - 8);
            } else {
                ret.stitle = t.title;
            }
        } else {
            ret.stitle = tag;
        }
        ret.imageLink = t.imageLink ? t.imageLink : null;
        ret.imageUrl = t.imageUrl ? t.imageUrl : null;
        ret.desc = t.desc ? t.desc : null;
        ret.articles = ("articles" in t) ? t.articles : [];
        ret.count = t.count ? t.count : 0;
        return ret;
    }

    function queryArticles(query, articles, tagList) {
        if (query == "") {
            const recentCount = 8;
            const articles2 = [].concat(
                searchArticles("", articles).slice(0, recentCount),
                searchArticles("#pickup", articles),
            );
            const articles3 = [];
            const urls = {};
            for (const a of articles2) {
                if (a.url in urls) {
                    articles3[urls[a.url]].score = a.score;
                    articles3[urls[a.url]].liststyle = a.liststyle;
                } else {
                    articles3.push(a);
                    urls[a.url] = Object.keys(urls).length;
                }
            }
            return articles3;
        }
        if (getTagInfo(query, tagList).articles == null) {
            return null;
        }
        if (query == "#all") {
            return searchArticles("", articles);
        }
        return searchArticles(query, articles);
    }

    function searchArticles(query, articles) {
        query = normalizeQuery(query);
        let result1 = [];
        for (let i = 0; i < articles.length; i++) {
            let article = articles[i];
            let article2 = {
                score: 4,
                title: article.title,
                posted: article.posted,
                date: article.date,
                url: article.url,
                tags: article.tags,
                keyword1: article.keyword1,
                keyword2: article.keyword2,
            };
            result1.push(article2);
        }
        if (query == "") {
            result1 = searchByKeyword("", result1);
        } else {
            let words = query.split(' ');
            for (let i = 0; i < words.length; i++) {
                let w = words[i];
                result1 = searchByKeyword(w, result1);
            }
        }
        for (let i = 0; i < result1.length; i++) {
            let article = result1[i];
            let liststyle = (article.score >= 4)? "\"★ \"" : (article.score >= 3)? "\"\\2714  \"" : (article.score >= 2)? "disc" : "circle";
            article.liststyle = "list-style-type:" + liststyle;
        }
        return result1;
    }

    function normalizeQuery(query) {
        query = query.toLowerCase();
        query = query.replace(/[ 　	]+/g, ' ');
        query = query.trim();
        return query;
    }

    function searchByKeyword(keywd, articles) {
        let result = [];
        for (let i in articles) {
            let article = articles[i];
            let score = calcScore(article, keywd);
            if (score > article.score) score = article.score;
            if (score > 0) {
                let article2 = {
                    score: score,
                    title: article.title,
                    date: article.date,
                    url: article.url,
                    tags: article.tags,
                    keyword1: article.keyword1,
                    keyword2: article.keyword2,
                };
                result.push(article2);
            }
        }
        return result;
    };

    function calcScore(article, keywd) {
        let score = 0;
        if (keywd == "") {
            score = 1;
        } else if (article.keyword1.find(k => k == keywd)) {
            score = 3;
            if (article.keyword1.find(k => k == "#pickup")) {
                score = 4;
            }
        } else if (article.keyword2.find(k => k == keywd)) {
            score = 2;
        } else {
            if (keywd == "java") {
                const ex = "javascript";
                if (article.keyword1.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                    article.keyword2.find(k => k.startsWith(keywd) && !k.startsWith(ex)) ||
                    article.title.toLowerCase().indexOf(keywd) >= 0 && article.title.toLowerCase().indexOf(ex) < 0) {
                    score = 1;
                }
            } else if (keywd == "jq") {
                const ex = "jquery";
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
        return score;
    }

    function getQueryFromUrl() {
        if (window.location.hash.startsWith("#")) {
            return window.location.hash.substring(1);
        } else {
            return "";
        }
    }
    function pushState(query, tagList) {
        if (query == "") {
            history.pushState(undefined, getTagInfo(query, tagList).title + " | suzuki-navi", "./");
        } else {
            history.pushState(undefined, getTagInfo(query, tagList).title + " | suzuki-navi", "./#" + query);
        }
    }

    const app = Vue.createApp({
        data() {
            return {
                _query: getQueryFromUrl(),
                _articles: [],
                _tags: [],
                _tagList: new Map(tagList),
            }
        },
        computed: {
            title() {
                return getTagInfo(this.query, this._tagList).title;
            },
            query: {
                get() {
                    return this._query;
                },
                set(newVal) {
                    this._query = newVal;
                },
            },
            queryImageLink() {
                return getTagInfo(this.query, this._tagList).imageLink;
            },
            queryImageUrl() {
                const url = getTagInfo(this.query, this._tagList).imageUrl;
                if (url == null) {
                    return null;
                } else if (url.startsWith("http")) {
                    return url;
                } else {
                    return "img/" + url;
                }
            },
            tagDesc() {
                return getTagInfo(this.query, this._tagList).desc;
            },
            articles() {
                return queryArticles(this.query, this._articles, this._tagList);
            },
            articleCount() {
                const articles = queryArticles(this.query, this._articles, this._tagList);
                return articles ? articles.length : 0;
            },
        },
        methods: {
            tagTitle(tag) {
                return getTagInfo(this.tag, this._tagList).stitle;
            },
            tagClicked(event) {
                if (event.ctrlKey) {
                    return;
                }
                event.preventDefault();
                const app = this;
                function sub(elem) {
                    if (elem.dataset.tag) {
                        app.cardGoto(elem.dataset.tag);
                    } else {
                        sub(elem.parentElement);
                    }
                }
                sub(event.target);
            },
            tags(category) {
                const app = this;
                if (category == null) {
                    const tags = [...getTagsByCategory(category, app._tagList).keys()];
                    tags.sort(function(a, b) {
                        const ac = getTagInfo(a, app._tagList).count;
                        const bc = getTagInfo(b, app._tagList).count;
                        return bc - ac;
                    });
                    return tags;
                }
                return getTagsByCategory(category, this._tagList).keys();
            },
            cardGoto(query) {
                if (query == "#") {
                    query = "";
                }
                if (getQueryFromUrl() != this.query) {
                    pushState(normalizeQuery(this.query), this._tagList);
                }
                this.query = query;
                pushState(query, this._tagList);
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            },
            historyGoto(query) {
                this.query = query;
            }
        },
        mounted() {
            const app = this;
            articleRetriever.push(function(articles, tags) {
                app._articles = articles;
                app._tagList = new Map(tagList);
                //app._tags = tags;
            });
            window.onpopstate = function(event) {
                app.historyGoto(getQueryFromUrl());
            };
            document.getElementById("body").style.display = "";
        },
    });

    app.component("taglink", {
        props: ["tag", "countView"],
        data() {
            return {
                _tagList: new Map(tagList),
            }
        },
        computed: {
            tagTitle() {
                return getTagInfo(this.tag, this._tagList).stitle;
            },
            count() {
                return getTagInfo(this.tag, this._tagList).count;
            },
        },
        methods: {
            tagClicked(event) {
                this.$emit("tag-clicked", event);
            },
        },
        mounted() {
            const app = this;
            articleRetriever.push(function(articles, tags) {
                app._tagList = new Map(tagList);
            });
        },
        template: `
          <a v-on:click="tagClicked" :data-tag="tag" :href="'./#' + tag" class="tag-holder">
            <span class="tag">{{tagTitle}}</span><span v-if="count>0 && countView=='on'" class="tag-count">{{count}}</span>
          </a>
        `,
    });

    app.mount("#body");
});
