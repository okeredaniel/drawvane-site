import JournalArticle from "./JournalArticle";
import { JOURNAL_ARTICLES } from "@/lib/journal";

export default function TeamAlignment() {
  return <JournalArticle article={JOURNAL_ARTICLES["announcing-stratora-1-0"]} />;
}
