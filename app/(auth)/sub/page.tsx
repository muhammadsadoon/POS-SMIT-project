import Navbar from '@/components/navbar';
import RippleGrid from '@/components/rappleGrid';
import { Title } from '@mantine/core';

const PublicPage = () => {
  return (
    <div>
      <Navbar className={"h-12 border-bottom border-xl"}>
        <Title>Hello world</Title>
      </Navbar>
      <div className='overflow-hidden relative h-dvh w-full'>
        <RippleGrid
          enableRainbow={false}
          gridColor="#1b9200"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.8}
        >
          <Title>Sub Page</Title>
        </RippleGrid>
      </div>
      <div style={{ height: "300vh" }}>
      </div>
    </div>
  )
}

export default PublicPage;