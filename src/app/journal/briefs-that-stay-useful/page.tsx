import JournalArticle from "@/components/sections/JournalArticle";
import { JOURNAL_ARTICLES } from "@/lib/journal";

const article = JOURNAL_ARTICLES["briefs-that-stay-useful"];
export const metadata = { title: `${article.title} | Stratora`, description: article.subtitle };
export default function Page() { return <JournalArticle article={article} />; }
