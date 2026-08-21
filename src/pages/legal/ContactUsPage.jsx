import React from 'react'

const ContactUsPage = () => {
  return (
    <div className="w-full px-5 py-16 sm:px-8 sm:py-20">
  <div className="mx-auto max-w-5xl">

    <h1 className="text-xl font-semibold tracking-tight text-gray-800 sm:text-3xl">
      Contact information
    </h1>

    <p className=" text-sm font-normal leading-7 text-gray-600 ">
      You can contact us anytime via Whatsapp on{" "}
      <a
        href="https://wa.me/919485628238"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-amber-600"
      >
        9485628238
      </a>{" "}
      or write to us at{" "}
      <a
        href="mailto:care@astrotring.com"
        className="font-medium text-amber-600"
      >
        care@astrotring.com

      </a>
      .
    </p>

    <div className="mt-8  pt-8">
      <p className="text-sm leading-6 text-gray-600 ">
        <strong className="font-semibold text-gray-900">
          Important Note:
        </strong>{" "}
        If you're reaching out from a mobile number or email ID different
        from your registered one, please don't forget to share your Order ID.
        This will help us to resolve your query much faster.
      </p>
    </div>

  </div>
</div>
  )
}

export default ContactUsPage