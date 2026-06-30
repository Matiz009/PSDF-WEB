import C4 from './C4'
const C3 = ({width,color}) => {
    
  return (
    <div>
        <h3>This is C3</h3>
        <C4 color={color} />
        <h5>{width}</h5>
    </div>
  )
}

export default C3
