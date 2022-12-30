import md from 'markdown-it';
import { Styleable } from '../types/Styleable';
import { RawHtml } from './RawHtml';

export function Markdown({ content, className }: { content:string } & Partial<Pick<Styleable, 'className'>>) {
  const markdown2html = md();

  return <RawHtml className={className} html={markdown2html.render(content)} />;
}
