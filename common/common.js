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

    function calcScore(article, keywd, githubWikiFlag) {
        let score = 0;
        if (keywd == "") {
            if (article.keyword1.find(k => k == "#unlisted")) {
                score = 0;
            } else if (article.posted == "") {
                score = 0;
            } else {
                score = 1;
            }
        } else if (keywd == ".") {
            score = 1;
        } else if (article.keyword1.find(k => k == keywd)) {
            score = 2;
            if (article.keyword1.find(k => k == "#pickup")) {
                score = 3;
            }
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
        if (article.posted == "" && !githubWikiFlag) {
            score = 0;
        }
        return score;
    }
    function searchByKeyword(keywd, articles, githubWikiFlag) {
        let result = [];
        for (let i in articles) {
            let article = articles[i];
            let score = calcScore(article, keywd, githubWikiFlag);
            if (score > article.score) score = article.score;
            if (score > 0) {
                let article2 = {
                    score: score,
                    title: article.title,
                    date: article.date,
                    url: article.url,
                    keyword1: article.keyword1,
                    keyword2: article.keyword2,
                    body: article.body,
                    lang: article.lang,
                    position: article.position,
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
        for (let i = 0; i < articles.length; i++) {
            let article = articles[i];
            let article2 = {
                score: 3,
                title: article.title,
                posted: article.posted,
                date: article.date,
                url: article.url,
                keyword1: article.keyword1,
                keyword2: article.keyword2,
                body: "",
                lang: "",
                position: "",
            };
            result1.push(article2);
        }
        if (query == "") {
            const recent_count = 20;
            result1 = searchByKeyword("", result1, false);
            if (result1.length > recent_count) {
                result1 = result1.slice(0, recent_count);
            }
        } else {
            let words = query.split(' ');
            const githubWikiFlag = (words.length > 1);
            for (let i = 0; i < words.length; i++) {
                let w = words[i];
                result1 = searchByKeyword(w, result1, githubWikiFlag);
            }
        }
        for (let i = 0; i < result1.length; i++) {
            let article = result1[i];
            let liststyle = (article.score >= 3)? "★" : (article.score >= 2)? "\\2714" : "・";
            article.liststyle = "list-style-type:\"" + liststyle + "\"";
        }
        let count = result1.length;
        return {
            "articles1": result1,
            "count": count,
        };
    }
    function searchArticlesTitle(query) {
        query = normalizeQuery(query);
        let title1 = "\"" + query + "\" の記事";
        switch (query) {
        case "":
            title1 = "最近の記事";
            break;
        case "#tags":
            title1 = "";
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
            title1 = "Google Cloudに関する記事";
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
        return title1;
    }
    function searchSnippets(query, snippets) {
        query = normalizeQuery(query);
        let result1 = [];
        for (let i = 0; i < snippets.length; i++) {
            let snippet = snippets[i];
            let snippet2 = {
                score: 3,
                title: "",
                date: "",
                url: snippet.url,
                keyword1: snippet.keyword1,
                keyword2: [],
                body: snippet.body,
                lang: snippet.lang,
                position: snippet.position,
            };
            result1.push(snippet2);
        }
        if (query == "") {
            result1 = [];
        } else {
            let words = query.split(' ');
            if (words.length <= 1) {
                result1 = [];
            } else {
                for (let i = 0; i < words.length; i++) {
                    let w = words[i];
                    result1 = searchByKeyword(w, result1, false);
                }
            }
        }
        let count = result1.length;
        return {
            "snippets": result1,
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
        snippets: [],
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
        let list2 = [];
        let tags = {};
        for (let i = 0; i < list.length; i++) {
            let entry = list[i];
            if (entry["posted"] == "") {
                if (entry["updated"] == "") {
                    entry["date"] = "";
                } else {
                    entry["date"] = "(" + entry["updated"] + "更新)";
                }
            } else {
                if (entry["updated"] == "") {
                    entry["date"] = "(" + entry["posted"] + ")";
                } else {
                    entry["date"] = "(" + entry["posted"] + "投稿 " + entry["updated"] + "更新)";
                }
            }
            if (!entry["keyword2"]) {
                entry["keyword2"] = [];
            }
            if (!entry["keyword3"]) {
                entry["keyword3"] = [];
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
            entry["keyword1"] = extractSynonymIndex(entry["keyword1"]);
            entry["keyword2"] = extractSynonymIndex(entry["keyword2"]);

            // keyword3はタグに入れないけど検索キーワード
            for (const kw of entry["keyword3"]) {
                entry["keyword2"].push(kw);
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
        articles.list = list2;
        articles.tags = tags;
    });
    function loadSnippets(list) {
        function basename(url) {
            const p = url.lastIndexOf("/");
            if (p < 0) return "";
            return url.substring(p + 1);
        }
        if (list.length == 0) return;
        const url = list[0];
        const fname = basename(url);
        const listTail = list.slice(1);
        axios.get(url).then(response => {
            const data = response.data;
            const lines = data.split("\n");
            const lineCount = lines.length;
            const commentPattern1 = /^# *(.+)$/;
            const commentPattern2 = /^\/\/ *(.+)$/;
            const urlPattern1 = /^(# *)(https?:\/\/.+)$/;
            const urlPattern2 = /^(\/\/ *)(https?:\/\/.+)$/;
            let flag = 0;
            let url = "";
            let keywords = [];
            let lang = "";
            let body = "";
            let position = "";
            for (let i = 0; i < lineCount; i++) {
                const line = lines[i];
                if (line.startsWith("##")) {
                    // nothing
                } else if (flag == 0) {
                    if (line != "") {
                        position = fname + ":" + (i+1);
                        let matched = line.match(commentPattern1);
                        if (!matched) {
                            matched = line.match(commentPattern2);
                        }
                        if (matched) {
                            const ks = matched[1].split(/ +/);
                            for (let i in ks) {
                                const k = ks[i];
                                if (k != "") keywords.push(k);
                            }
                            lang = keywords[0];
                        } else {
                            i--;
                        }
                        flag = 1;
                    }
                } else if (flag == 1) {
                    if (line != "" ){
                        let line2 = line;
                        if (url == "") {
                            let matched = line.match(urlPattern1);
                            if (!matched) {
                                matched = line.match(urlPattern2);
                            }
                            if (matched) {
                                url = matched[2];
                                line2 = "";
                            }
                        }
                        if (line2 != "") {
                            body += line2 + "\n";
                        }
                    } else {
                        if (keywords.length > 0 && body != "") {
                            keywords = extractSynonymIndex(keywords);
                            articles.snippets.push({
                                url: url,
                                keyword1: keywords,
                                body: body,
                                lang: lang,
                                position: position,
                            });
                        }
                        flag = 0;
                        url = "";
                        keywords = [];
                        lang = "";
                        body = "";
                        position = "";
                    }
                }
            }
            loadSnippets(listTail);
        });
    }
    loadSnippets([
        multilangs_snippets_url,
        cpp_snippets_url,
        scala_snippets_url,
        java_snippets_url,
        javascript_snippets_url,
        ruby_snippets_url,
        python_snippets_url,
        shell_snippets_url,
        other_snippets_url,
    ]);
    function keywordDatabase() {
        return  [
            {tag: "#machine_learning", categories: [["thema", "機械学習の記事"]]},
            {tag: "#statistics",       categories: [["thema", "統計の記事"]]},
            {tag: "#visualization",    categories: [["thema", "データ可視化の記事"]]},
            {tag: "#data_store",       categories: [["thema", "データ保管の記事"]]},
            {tag: "#data_input",       categories: [["thema", "データ収集の記事"]]},
            {tag: "#programming",      categories: [["thema", "プログラミング"]]},
            {tag: "#math",             categories: [["thema", "数式のある記事"]]},

            {tag: "#certification",    categories: [["thema2", "取得した資格"]]},
            {tag: "#count",            categories: [["thema2", "書いた記事数"]]},
            {tag: "#my_open_sources",  categories: [["thema2", "作っているもの"]]},
            {tag: "#my_cases",         categories: [["thema2", "主な公開事例"]]},

            {tag: "gcp",               categories: [["cloud_gcp", "Google Cloud"], ["recently", "Google Cloud"]]},
            {tag: "bigquery",          categories: [["cloud_gcp", "BigQuery"]]},
            {tag: "cloudsql",          categories: [["cloud_gcp", "Cloud SQL"]]},
            {tag: "computeengine",     categories: [["cloud_gcp", "Compute Engine"]]},
            {tag: "gcs",               categories: [["cloud_gcp", "Cloud Storage"]]},
            {tag: "dataflow",          categories: [["cloud_gcp", "Dataflow"]]},
            {tag: "cloudtranslation",  categories: [["cloud_gcp", "Cloud Translation"]]},
            {tag: "cloudfunctions",    categories: [["cloud_gcp", "Cloud Functions"]]},
            // {tag: "gcp_container_registry", categories: [["cloud_gcp", "Container Registry"]]},
            {tag: "firebase",          categories: [["cloud_gcp", "Firebase"]]},

            {tag: "aws", categories: [["cloud_aws", "AWS"]]},
            {tag: "s3", categories: [["cloud_aws", "S3"]]},
            {tag: "rds", categories: [["cloud_aws", "RDS"]]},
            {tag: "aurora", categories: [["cloud_aws", "Aurora"]]},
            {tag: "redshift", categories: [["cloud_aws", "Redshift"]]},
            {tag: "dynamodb",   categories: [["cloud_aws", "DynamoDB"]]},
            {tag: "documentdb", categories: [["cloud_aws", "DocumentDB"]]},
            {tag: "lambda",     categories: [["cloud_aws", "Lambda"]]},
            {tag: "apigateway", categories: [["cloud_aws", "API Gateway"]]},
            {tag: "sqs",        categories: [["cloud_aws", "SQS"]]},
            {tag: "aws_sns",        categories: [["cloud_aws", "SNS"]]},
            {tag: "stepfunctions",  categories: [["cloud_aws", "Step Functions"]]},
            {tag: "alb",        categories: [["cloud_aws", "ALB"]]},
            {tag: "cognito",    categories: [["cloud_aws", "Cognito"]]},
            {tag: "glue",       categories: [["cloud_aws", "Glue"]]},
            {tag: "comprehend", categories: [["cloud_aws", "Comprehend"]]},
            {tag: "cloudformation", categories: [["cloud_aws", "CloudFormation"]]},
            {tag: "cloudwatch", categories: [["cloud_aws", "CloudWatch"]]},
            {tag: "cloudtrail", categories: [["cloud_aws", "CloudTrail"]]},
            {tag: "ec2",    categories: [["cloud_aws", "EC2"]]},
            {tag: "dms",    categories: [["cloud_aws", "DMS"]]},
            {tag: "athena",    categories: [["cloud_aws", "Athena"]]},
            {tag: "aws_sdk", categories: [["cloud_aws", "SDK"]]},
            {tag: "boto3", categories: [["cloud_aws", "boto3"]]},

            {tag: "scala",      categories: [["lang", "Scala"]]},
            {tag: "java",       categories: [["lang", "Java"]]},
            {tag: "c#",         categories: [["lang", "C#"]]},
            {tag: "c++",        categories: [["lang", "C++"]]},
            {tag: "clang",      categories: [["lang", "C言語"]], desc: "私にとって始めてさわったプログラミング言語"},
            {tag: "javascript", categories: [["lang", "JavaScript"]]},
            {tag: "php",        categories: [["lang", "PHP"]]},
            {tag: "perl",       categories: [["lang", "Perl"]]},
            {tag: "rust",       categories: [["lang", "Rust"]]},
            {tag: "golang",     categories: [["lang", "Go言語"]]},
            {tag: "ruby",       categories: [["lang", "Ruby"]]},
            {tag: "python",     categories: [["lang", "Python"]]},
            {tag: "elixir",     categories: [["lang", "Elixir"]]},
            {tag: "powershell", categories: [["other_more", "PowerShell"]]},

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
            {tag: "googlecolab", categories: [["software", "Google Colaboratory"]]},
            {tag: "tensorflow", categories: [["software", "TensorFlow"]]},
            {tag: "matplotlib", categories: [["software", "Matplotlib"]]},
            {tag: "talend", categories: [["software", "Talend"]]},
            {tag: "dbeaver", categories: [["software", "DBeaver"]]},

            {tag: "command", categories: [["other", "Linuxコマンド"], ["command", "Linuxコマンド"]]},
            //{tag: "git", categories: [["command", "git"]]},
            //{tag: "diff", categories: [["command", "diff"]]},
            //{tag: "sed", categories: [["command", "sed"]]},
            //{tag: "curl", categories: [["command", "curl"]]},
            //{tag: "wget", categories: [["command", "wget"]]},
            //{tag: "jq", categories: [["command", "jq"]]},
            //{tag: "xargs", categories: [["command", "xargs"]]},
            //{tag: "seq", categories: [["command", "seq"]]},
            //{tag: "printf", categories: [["command", "printf"]]},
            //{tag: "date", categories: [["command", "date"]]},
            //{tag: "find", categories: [["command", "find"]]},
            //{tag: "rm", categories: [["command", "rm"]]},
            //{tag: "column", categories: [["command", "column"]]},
            //{tag: "uname", categories: [["command", "uname"]]},
            //{tag: "unzip", categories: [["command", "unzip"]]},
            //{tag: "7z", categories: [["command", "7z"]]},
            //{tag: "du", categories: [["command", "du"]]},
            //{tag: "pv", categories: [["command", "pv"]]},
            //{tag: "vipe", categories: [["command", "vipe"]]},
            //{tag: "grep", categories: [["command", "grep"]]},
            //{tag: "arp", categories: [["command", "arp"]]},
            //{tag: "pwsh", categories: [["command", "pwsh"]]},
            //{tag: "gsutil",  categories: [["command", "gsutil"], ["cloud_gcp", "gsutil"]]},
            //{tag: "bq",      categories: [["command", "bq"],     ["cloud_gcp", "bq"]]},
            {tag: "awscli",  categories: [["command", "aws"],    ["cloud_aws", "awscli"]]},

            {tag: "#naviplus", categories: [["hidden", ""]]},
            {tag: "#beex", categories: [["hidden", ""]]},
            {tag: "#business_blog", categories: [["hidden", ""]]},
            {tag: "#qiita", categories: [["hidden", ""]]},
            {tag: "#hatenablog", categories: [["hidden", ""]]},
            {tag: "#github_markdown", categories: [["hidden", ""]]},
            {tag: "#pickup", categories: [["hidden", ""]]},
            {tag: "#unlisted", categories: [["hidden", ""]]},

            {tag: "atcoder", categories: [["other", "AtCoder"]]},
            {tag: "raspberry_pi", categories: [["other", "Raspberry Pi"]]},
            {tag: "#serverless", categories: [["other", "サーバレス開発"]]},
            {tag: "#front_end", categories: [["other", "フロントエンド"]]},
            {tag: "#deep_learning", categories: [["other", "深層学習"]]},
            {tag: "serverless_framework", categories: [["other", "Serverless Framework"], ["recently", "Serverless Framework"]]},
            {tag: "#image", categories: [["other", "画像処理"]]},
            {tag: "#movie", categories: [["other", "動画処理"]]},
            {tag: "#natural_language_processing", categories: [["other_more", "自然言語処理"]]},
            {tag: "#numerical_analysis", categories: [["other_more", "数値計算"]]},
            {tag: "#probability_distribution", categories: [["other_more", "確率分布"]]},
            {tag: "#gradient_descent", categories: [["other_more", "勾配降下法"]]},
            {tag: "#network", categories: [["other_more", "ネットワーク"]]},
            {tag: "#piano", categories: [["other_more", "ピアノ"]]},
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
    function tagsTemplate(id) {
        let thres = 4;
        return `
            <div>
              <h2>最近のテーマ</h2>
              <p><span v-for="(tag, idx) in categorized.recently">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}</a>
              </span></p>
            </div>
            <div>
              <h2>クラウド環境記事 - Google Cloud</h2>
              <p><span v-for="(tag, idx) in categorized.cloud_gcp">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span></p>
            </div>
            <div>
              <h2>クラウド環境記事 - AWS</h2>
              <p><span v-for="(tag, idx) in categorized.cloud_aws">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span></p>
            </div>
            <div>
              <h2>プログラミング言語別記事</h2>
              <p><span v-for="(tag, idx) in categorized.lang">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span></p>
            </div>
            <div>
              <h2>ソフトウェア別記事</h2>
              <p><span v-for="(tag, idx) in categorized.software">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span></p>
            </div>
<!--
            <div>
              <h2>Linuxコマンドの記事</h2>
              <p><span v-for="(tag, idx) in categorized.command">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span></p>
            </div>
-->
            <div>
              <h2>その他</h2>
              <p><span v-for="(tag, idx) in categorized.thema">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}({{ tag[1] }})</a>
              </span></p>
              <p><span v-for="(tag, idx) in categorized.other">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
              <span class="font-small"> / </span>
              <input type="checkbox" id="othertags-` + id + `-checkbox">
              <label for="othertags-` + id + `-checkbox" id="othertags-` + id + `-label">more...</label>
              <span id="othertags-` + id + `">
              <span v-for="(tag, idx) in categorized.other_more">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);" v-bind:class="(tag[1]<` + thres + `)? 'font-small':''">{{ tag[2] }}({{ tag[1] }})</a>
              </span>
              </span></p>
            </div>
            <div>
              <p><span v-for="(tag, idx) in categorized.thema2">
                <span v-if="idx>0" class="font-small"> / </span>
                <a v-bind:href="'#' + tag[0]" v-on:click.prevent.stop="gotoTagPage(tag[0]);">{{ tag[2] }}</a>
              </span></p>
            </div>
            <p>
              <a href="" v-on:click.prevent.stop="gotoTagPage('');">top</a>
            </p>
        `;
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
            title1: function () { return searchArticlesTitle(this.query); },
            count_str: function () { return getCountStr(this.query, this.result); },
            snippets_result: function () { return searchSnippets(this.query, this.articles.snippets); },
            desc: function () { return descFromTag(this.query); },
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
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            },
        },
        template: `
          <div>
            <div id="tags-label-wrapper">
              <a v-if="global_query.query=='#tags'" href="#" v-on:click.prevent.stop="history.back();">[close tags]</a>
              <a v-if="global_query.query!='#tags'" href="#tags" v-on:click.prevent.stop="gotoTagPage('#tags');">[tags...]</a>
            </div>
            <input v-model="global_query.query" placeholder="Search articles" onfocus="this.select()">
            <h1 v-if="title1">{{ title1 }} {{ count_str }}</h1>
            <p v-if="desc">{{ desc }}</p>
            <ul v-if="result.articles1.length > 0">
              <li v-for="article in result.articles1" v-bind:style="article.liststyle">
                <a v-bind:href="article.url" target="_blank">{{ article.title }}</a> {{ article.date }}
              </li>
            </ul>
            <template v-if="snippets_result.snippets.length > 0">
              <h1>"{{ global_query.query }}" のsnippet ({{ snippets_result.snippets.length }})</h1>
              <div v-for="snippet in snippets_result.snippets" class="snippet">
                <div class="snippet-lang" v-if="snippet.lang!='.'">{{ snippet.lang }}</div>
                <div class="snippet-position" v-if="snippet.position!='.'">{{ snippet.position }}</div>
                <div class="snippet-url" v-if="snippet.url"><a :href="snippet.url" target="_blank">{{ snippet.url }}</a></div>
                <pre>{{ snippet.body }}</pre>
              </div>
            </template>
            <section v-if="global_query.query=='#machine_learning'">
              <p class="image"><a href="https://qiita.com/suzuki-navi/items/2581b3f4afeeabeacace"><img src="ml.png"></a></p>
            </section>
            <section v-if="global_query.query=='#math'">
              <p class="image"><a href="https://tech.naviplus.co.jp/2014/02/27/%e4%b8%8d%e5%81%8f%e5%88%86%e6%95%a3%e3%81%af%e3%81%aa%e3%81%9c-n-1-%e3%81%a7%e5%89%b2%e3%82%8b%e3%81%ae%e3%81%8b%ef%bc%9f/"><img src="math.png"></a></p>
            </section>
            <section v-if="global_query.query=='git'">
              <p class="image"><a href="https://qiita.com/suzuki-navi/items/fdcb166f32b28bc0ff82"><img src="cli.png"></a></p>
            </section>
            <section v-if="global_query.query=='raspberry_pi'">
              <p class="youtube"><iframe width="352" height="198" src="https://www.youtube-nocookie.com/embed/wFTvOIsHmQo?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>
            </section>
            <section v-if="global_query.query=='#certification'">
              <ul>
                <li>AWS Certified Database - Specialty (2020/10/19) <a href="https://qiita.com/suzuki-navi/items/59f8a4a94ad9a22dd569">合格体験記事</a></li>
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
            </section>
            <section v-if="global_query.query=='#my_open_sources'">
              <ul>
                <li><a href="https://github.com/xsvutils/xsvutils">xsvutils</a> (2017/12 〜)
                  <p>CSVファイルやTSVファイルをCUIで扱うツール。</p>
                </li>
                <li><a href="https://github.com/suzuki-navi/suzuki-navi-calendar">suzuki-navi's calendar</a> (2021/02 ～)
                  <p>自分専用カレンダーコマンド</p>
                </li>
                <li><a href="https://github.com/suzuki-navi/aws-glue-job-history">aws-glue-job-history</a> (2021/02 ～)
                  <p>AWS Glue Jobの実行履歴を表示するコマンド</p>
                </li>
                <li><a href="https://github.com/suzuki-navi/j2cli5">j2cli5</a> (2021/03 ～)
                  <p>Pythonのjinja2の簡易CLI化</p>
                </li>
              </ul>
            </section>
            <section v-if="global_query.query=='#my_cases'">
              <ul>
                <li><a href="https://www.naviplus.co.jp/search/">ECサイトの検索エンジン</a> (2013/05 〜 2019/07)
                  <p>多数のECサイトの検索エンジン開発/導入/運用に携わる</p>
                  <ul>
                    <li><a href="https://www.naviplus.co.jp/search/interview_surugaya.html">主な導入事例</a></li>
                  </ul>
                </li>
              </ul>
              <p class="image">
                <img src="search-2.png">
              </p>
            </section>
            <section v-if="global_query.query=='#tags'" class="tagsindex">` + tagsTemplate(1) + `
            </section>
            <section v-if="global_query.query==''">
              <p class="image">
                <img src="./atcoder.png" height="180" width="320">
              </p>
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
                window.scroll({
                    top: 0,
                    left: 0,
                    behavior: 'smooth',
                });
            },
        },
        template: "<div class=\"tagsindex\">" + tagsTemplate(2) + "</div>",
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
