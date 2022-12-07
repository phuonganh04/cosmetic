export const HomeAdv = () => {
  const images = [
    { url: "http://mauweb.monamedia.net/harosa/wp-content/uploads/2018/08/1_1.jpg" },
    { url: "http://mauweb.monamedia.net/harosa/wp-content/uploads/2018/08/2_1.jpg" },
  ]
  return (
    <div className="flex py-[50px]">
      {images.map(image => (
        <span className="overflow-hidden" key={image.url}>
          <img className="transition-all hover:scale-110" src={image.url} />
        </span>
      ))}
    </div>
  )
}