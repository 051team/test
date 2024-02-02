import Wrapper from '../components/wrapper'
import Cases from '../components/cases'
import { fetchCases } from '../utils/fCases';
import { fetchLiveDrops } from '../utils/fLivedrop';


export async function getStaticProps() {
  try {
    const allCases = await fetchCases();
    const liveDrops = await fetchLiveDrops();

    return {
      props: {
        cases: allCases,
        liveDrops:liveDrops,
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
      <Wrapper title="Casa de Papel" liveDrops={liveDrops}>
        <Cases cases={cases} />
      </Wrapper>
    </>
  )
}
