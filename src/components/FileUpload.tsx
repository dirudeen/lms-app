import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";


interface FileUploadProps {
    endpoint: keyof typeof ourFileRouter
    onchange: (url?: string, name?: string) => void
}

export function FileUpload({endpoint, onchange}: FileUploadProps){

    return <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onchange(res?.[0]?.url, res?.[0]?.name)
        }}
        onUploadError={(error: Error) => {
            toast.error(error.message)
        }}
        />

}