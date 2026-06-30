import C3 from './C3'

const C2 = ({width,size,color}) => {
   
  return (
    <>
    <h2>This is C2</h2>
    <C3 width={width} color={color} />
    <h3>Size:{size}</h3>
    </>
  )
}

export default C2
