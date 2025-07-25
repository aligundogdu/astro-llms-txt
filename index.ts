import fs from 'fs';
import path from 'path';
import {parse} from 'node-html-parser';
import type {AstroIntegration, RouteData} from 'astro';
//@ts-ignore
import {JSDOM} from "jsdom";
import {Readability} from "@mozilla/readability";
//@ts-ignore
import TurndownService from 'turndown';

export default function llmsTxtIntegration(): AstroIntegration {

    return {
        name: 'astro-llms-txt',
        hooks: {
            //@ts-ignore
            'astro:build:done': async ({dir, routes, logger}): Promise<void> => {
                logger.info('llms.txt integration is starting...');
                const pathNames = routes.filter(route => route.type === 'page')
                    .flatMap(route => route.distURL || [])
                    .map(url => url.pathname);
                for (const urlPath of pathNames) {
                    try {

                        if (fs.existsSync(urlPath)) {
                            const htmlContent: string = fs.readFileSync(urlPath, 'utf-8');
                            const domRoot = parse(htmlContent);
                            const titleElement = domRoot.querySelector('title');
                            const title: string = titleElement ? titleElement.text.trim() : '';
                            const metaDescriptionElement = domRoot.querySelector('meta[name="description"]');
                            const metaDescription = metaDescriptionElement ? metaDescriptionElement.getAttribute('content') : '';
                            const dom = new JSDOM(htmlContent);
                            const reader = new Readability(dom.window.document);
                            const article = reader.parse();
                            const turndownService = new TurndownService({headingStyle: 'atx'});
                            const markdown = turndownService.turndown(article?.content);
                            const content = `# ${title}\r\n\r\n > ${metaDescription} \r\n\r\n ${markdown} \r\n\r\n\r\n\r\n`;
                            const outputPath: string = path.join(dir.pathname, 'llms.txt');
                            fs.appendFileSync(outputPath, content, 'utf-8');
                            const logFileName = urlPath.split("dist/")[1];
                            logger.info(`- /${logFileName}`);
                        }

                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Error';
                        logger.error(errorMessage);
                    }
                }

                logger.info('llms.txt integration complete.!');
            }
        }
    };
}