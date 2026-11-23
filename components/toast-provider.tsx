"use client"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


export function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3600}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable={false}
      theme="colored"
      toastClassName="!rounded-full !font-semibold"
      style={{ zIndex: 9999 }}
    />
  )
}
