
import { useParams } from "react-router-dom";
import { NewsBuilder } from "@/components/news/NewsBuilder";

const News = () => {
  const { id } = useParams();

  return <NewsBuilder newsId={id} />;
};

export default News;
