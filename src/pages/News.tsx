
import { useParams } from "react-router-dom";
import { NewsBuilder } from "@/components/news/NewsBuilder";

const News = () => {
  const { id } = useParams();

  console.log('News component rendering with ID:', id);

  return <NewsBuilder newsId={id} />;
};

export default News;
