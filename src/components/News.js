import React,{useEffect,useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";



const News=(props)=>  {

  const [articles,setArticles]=useState([])
  // eslint-disable-next-line
  const [loading,setLoading]= useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

 
  
 const CapitlizeString=(word)=>
{
    return word.charAt(0).toUpperCase() + word.slice(1);
}


  const updateNews= async ()=>
  {
    props.setProgress(0);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(60);

      setArticles(parsedData.articles)
      setTotalResults(parsedData.totalResults)
      setLoading(false)
    
    props.setProgress(100);
  }

  useEffect(() => {
    document.title=`${CapitlizeString(props.category)}- NewsNinza`;
    updateNews();
    // eslint-disable-next-line
  }, [])

  
  const img=(obj)=>{
    if(obj){
      return obj;
    }
    else{
      let imgUrl="https://linuxpip.org/wp-content/uploads/2021/07/composer-not-found.jpg"
      return imgUrl;
    }
  }


  const fetchMoreData = async () => {
    setPage(page+1)
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    let data =await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };


  
    return (
        <>
        <h1 className="text-center" style={{marginTop:'70px'}}>NewsNinza- Top {CapitlizeString(props.category)} Headlines </h1>
        
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
        <div className="row">
         {articles.map((element) => {
             return  <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title.slice(0, 45)}
                  description={element.description?.slice(0, 88)}
                  imageurl={img(element.urlToImage)}
                  newsUrl={element.url}
                  author={element.author}
                  publishedAt={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            
          })}
        </div>
        </div>
        
        </InfiniteScroll>
        
      </>
    );
  
}

News.defaultProps={
  country: 'in',
  pageSize: 6 ,
  category: 'general'
}


News.propTypes={
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News;
