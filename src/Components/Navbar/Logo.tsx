import SoundCloudLogo from '../../Assets/soundcloud.png'
import SoundCloudText from '../../Assets/soundcloud_scraper_text.png'

const Logo = () => {
    return(
        <div className='logo-container'>
            <img className='logo-image' src={SoundCloudLogo} />
            <img className='logo-text' src={SoundCloudText} />
        </div>
    )
}
export default Logo