import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
          {/* <!-- Hull --> */}
            {/* <!-- Gunwales --> */}
            <line x1="100" y1="395" x2="700" y2="395" stroke="black" stroke-width="2" />
            <line x1="100" y1="400" x2="700" y2="400" stroke="black" stroke-width="2" />
            <line x1="400" y1="100" x2="400" y2="700" stroke="black" stroke-width="2" />
            <line x1="100" y1="500" x2="700" y2="500" stroke="black" stroke-width="2" />
            <line x1="100" y1="505" x2="700" y2="505" stroke="black" stroke-width="2" />
            
            {/* <!-- Center Line --> */}
            <line x1="150" y1="450" x2="650" y2="450" stroke="black" stroke-dasharray="5,5" />
            <text x="180" y="470" font-family="Arial" font-size="12">Catch Length</text>
            <text x="520" y="470" font-family="Arial" font-size="12">Finish Length</text>

          {/* <!-- Oar Positions --> */}
          <line x1="400" y1="400" x2="200" y2="200" stroke="black" stroke-width="2" />
          <line x1="400" y1="400" x2="600" y2="200" stroke="black" stroke-width="2" />

          {/* <!-- Labels --> */}
          <text x="380" y="80" font-family="Arial" font-size="14">Blade Extraction</text>
        
          <text x="380" y="730" font-family="Arial" font-size="14">Blade Buried</text>
          <text x="300" y="200" font-family="Arial" font-size="14">Finish Position</text>
          <text x="500" y="200" font-family="Arial" font-size="14">Full Reach</text>

          {/* <!-- Arc and Angles --> */}
          <path d="M200 200 A200 200 0 0 1 600 200" fill="none" stroke="black" stroke-width="1" />
          <path d="M250 250 A150 150 0 0 1 550 250" fill="none" stroke="black" stroke-width="1" />
          <text x="300" y="100" font-family="Arial" font-size="12">Catch Angle</text>
          <text x="450" y="100" font-family="Arial" font-size="12">Finish Angle</text>
          
          {/* <!-- Footplate and Handle Overlap --> */}
          <rect x="350" y="380" width="100" height="40" fill="none" stroke="black" stroke-width="1" />
          <text x="360" y="420" font-family="Arial" font-size="12">Oar Handle Finish Overlap</text>
          
          {/* <!-- Dimensions --> */}
          
        </svg>
      </div>
    </>
  )
}

export default App
