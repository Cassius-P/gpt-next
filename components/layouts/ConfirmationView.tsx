type ConfirmationViewProps = {
    message: string;
    success?: boolean;
}

export default function ConfirmationView({ message, success = true }: ConfirmationViewProps) {

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full text-center items-center flex justify-center p-16">
                {success && (
                    <svg className="h-48 w-48" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                        <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    </svg>
                  )}
                {!success && (
                    <svg className="h-48 w-48 cross-anim" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="path circle" fill="none" stroke="#D06079" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                        <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="35" y1="35" x2="95" y2="95"/>
                        <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95" y1="35" x2="35" y2="95"/>
                    </svg>
                )}                  
            </div>
            <div className="text-center py-6">
                <h1 className="text-2xl text-gray-900">{message}</h1>
            </div>
        </div>
    )
}