import './Earth.css'

export default function Earth({ size = 80 }) {
  return (
    <div
      className="earth"
      style={{
        width:  size,
        height: size,
        backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
      }}
    />
  )
}
