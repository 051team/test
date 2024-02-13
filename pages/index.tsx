import Wrapper from '../components/wrapper'
import Cases from '../components/cases'
import { fetchCases } from '../utils/fCases';


export async function getStaticProps() {
  try {
    const allCases = await fetchCases();
    return {
      props: {
        cases: allCases,
        error: null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch cases:", error);
    return {
      props: {
        cases: [],
        error: "Failed to fetch cases. Please try again later.", 
      },
    };
  }
}


export default function Home({cases,liveDrops}:any) {
  return (
    <>
      <Wrapper title="051.io | NFT Cases">
        <Cases cases={cases} />
      </Wrapper>
    </>
  )
}
