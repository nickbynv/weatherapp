import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { BsFillSunFill, BsMoonFill, BsSearch } from 'react-icons/bs';
import { useFetchWeatherQuery } from './queries/useFetchWeatherQuery';
import theme from './store/theme';

export default observer(() => {
  const [search, setSearch] = useState('new york')
  const [inputValue, setInputValue] = useState('')
  const [date, setDate] = useState(new Date())

  setInterval(() => {
    setDate(new Date())
  }, 60000)

  const {
    data,
    isSuccess,
    isLoading,
    isError
  } = useFetchWeatherQuery({ search })

  const temp = () => {
    const c = (value: number | undefined) => (
      value ? (value - 273.15).toFixed(2) : '--'
    )

    return {
      current: c(data?.main?.temp),
      min: c(data?.main?.temp_min),
      max: c(data?.main?.temp_max)
    }
  }

  const convertedDate = () => {
    const month = date.getMonth()
    const day = date.getDate()
    const year = date.getFullYear()
    const dayOfWeek = date.getDay() - 1

    const monthsNames = [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December'
    ]

    const daysNames = [
      'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday', 'Sunday'
    ]

    const time = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    return {
      fullDate: `${daysNames[dayOfWeek]}, ${monthsNames[month]} ${day}, ${year}`,
      time
    }
  }

  return (
    <div id={theme.current} className='bg-main w-screen h-screen flex justify-center items-center relative transition-colors'>
      <button
        onClick={() => theme.switch()}
        className='theme-btn ring-[2px] flex justify-center items-center w-8 h-8 rounded-full absolute bottom-3 right-3 z-1 md:w-14 md:h-14 md:right-6 md:top-6'
      >{
          theme.current === 'light'
            ? <BsMoonFill size={20} style={{ marginLeft: '1px' }} />
            : <BsFillSunFill size={23} />
        }</button>

      <div className='w-[27rem] p-9 rounded-xl flex flex-col items-center md:w-[35rem] lg:w-[40rem]'>
        <form onSubmit={(e) => {
          e.preventDefault()
          if (inputValue.length) {
            setSearch(inputValue.toLowerCase())
            setInputValue('')
          }
        }} id={theme.current} className='text flex w-[98%] mb-7'>
          <input
            type='text'
            className='input w-full rounded-tl-lg rounded-bl-lg ring-[.5px] ring-gray-300 focus:outline-none px-3.5 text-lg shadow-lg'
            placeholder='Enter the city'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button
            type='submit'
            className='button flex justify-center items-center rounded-tr-xl rounded-br-xl w-16 h-9 md:h-12 ring-[.5px] ring-gray-300 shadow-lg'
          ><BsSearch /></button>
        </form>

        {isSuccess && (
          <div id={theme.current} className='bg-screen text w-full shadow-lg rounded-3xl text-center transition-colors md:py-4'>
            {data.cod == 200 && <>
              <div className="p-9 pb-0 flex flex-col justify-center items-center">
                <h1 className='text-5xl font-semibold mb-5'>{data?.name}</h1>
                <span className='text-xl font-light mb-2'>{convertedDate().fullDate}</span>
                <span className='text-xl font-light'>{convertedDate().time}</span>
              </div>

              <div className="px-9 flex flex-col justify-center items-center">
                <div className="text-center pb-9">
                  <img
                    className='mb-[-35px]'
                    src={`https://openweathermap.org/img/wn/${data?.weather[0].icon}@4x.png`}
                    alt="img"
                  />
                  <span className='text-5xl font-semibold'>{temp().current} &deg;C</span>
                </div>

                <div className="py-9 text-center">
                  <h1 className='text-3xl font-semibold mb-1.5'>
                    {data?.weather[0].main}
                  </h1>
                  <span className='text-xl font-light'>
                    {temp().min} &deg;C <span className='mx-2'>|</span> {temp().max} &deg;C
                  </span>
                </div>
              </div>
            </>}

            {data.cod == 404 && (
              <span className='text-3xl font-light'>City not found</span>
            )}
          </div>
        )}

        {isLoading && (
          <span id={theme.current} className='text text-2xl font-light'>Loading...</span>
        )}

        {isError && (
          <span id={theme.current} className='text text-2xl font-light'>An error has occurred</span>
        )}
      </div>
    </div>
  )
})