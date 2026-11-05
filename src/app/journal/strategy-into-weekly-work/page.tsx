import JournalArticle from "@/components/sections/JournalArticle";
import { JOURNAL_ARTICLES } from "@/lib/journal";

const article = JOURNAL_ARTICLES["strategy-into-weekly-work"];
export const metadata = { title: `${article.title} | Stratora`, description: article.subtitle };
export default function Page() { return <JournalArticle article={article} />; }
