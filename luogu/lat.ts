import cheerio from "cheerio";
import * as fs from "fs";
import { NodeWithChildren } from "domhandler/lib/node";

async function loadArticle(article: string) {
    const div = cheerio.load(await (await fetch(`https://luogu.com/article/${article}`)).text())("#app").children();

    const title = (div[0].firstChild as unknown as Text).data;
    const author = ((div[1].firstChild as NodeWithChildren).firstChild as unknown as Text).data;
    const time = ((div[2].firstChild as NodeWithChildren).firstChild as unknown as Text).data;
    const type = ((div[3].firstChild as NodeWithChildren).firstChild as unknown as Text).data;
    const content = (div[4].firstChild as unknown as Text).data;

    const uid = (await (await fetch(`https://www.luogu.com.cn/api/user/search?keyword=${author}`)).json()).users[0].uid;

    const mdtext = `author: [${author}](https://www.luogu.com.cn/user/${uid})
published_time: ${time}
type: ${type}
link: <https://www.luogu.com/article/${article}>
    
---
    
# ${title}
    
${content}`;

    fs.writeFile(`./articles/${article}.md`, mdtext, Object);

    return mdtext;
}

export = loadArticle;
