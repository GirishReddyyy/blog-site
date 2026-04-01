import { useForm } from 'react-hook-form'

function AddArticle() {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (formObj) => {
        console.log(formObj)
    }
    return (
        <div>
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <h1 className='text-2xl font-bold text-center mt-10'>Create A New Article</h1>
                <form onSubmit={handleSubmit(onSubmit)} className='max-w-lg rounded-md p-10 shadow-lg'>
                    {/* title */}
                    <input type="text" placeholder='enter the title to your article!'
                        className='border rounded p-2 w-full'
                        {...register("title", { required: "Title of an article is required!" })}
                    />
                    {
                        errors.title && (<p className='text-red-500 text-sm'>{errors.title.message}</p>)
                    }
                    {/* dropdown for category */}
                    <select className='w-full border mt-5 p-2 rounded' {...register("category", { required: "Category of an article is required!" })}>
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Education">Education</option>
                        <option value="AI">AI</option>
                        <option value="Programming">Programming</option>
                    </select>
                    {
                        errors.category && (<p className="text-red-500 text-sm">{errors.category.message}</p>)
                    }
                    {/* textarea for the content */}
                    <textarea placeholder='enter the content of your article' rows="5"
                        className='w-full p-3 mt-5 border rounded'
                        {...register("content", { required: "without any content would any person see your article!" })}
                    />
                    {errors.content && (
                        <p className="text-red-500 text-sm">{errors.content.message}</p>
                    )}
                    <div className='flex justify-center'>
                        <button className='bg-blue-400 text-white rounded mt-5 px-7 py-2'>Create Article!</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddArticle