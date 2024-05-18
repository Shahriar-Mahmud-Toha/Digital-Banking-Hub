import Card from "./components/card";
import Footer from "./components/footer";
import HomeNav from "./components/homenav";
import ImageCard from "./components/imagecard";



export default function Home() {
  return (
    <>
      <HomeNav/>
      <br/>
      <ImageCard/>
      <br/>
      <Card/>
      <br/><br/>
      <Footer/>
    </>
  );
}