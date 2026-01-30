import swal from 'sweetalert';

export const showAlert = () =>{
    swal({
        title: "Something went wrong!!!",
        text: "Please Contact you Administrator.",
        icon: "error",
        button: "OK"
    });
}



export const successAlert = (p_text,p_callb) =>{
    swal({
        title: "Success",
        text: p_text,
        icon: "success"
    }).then((willDelete) => {
        p_callb(willDelete);
    });
}

export const successWarning = (p_title,p_text,p_callb) =>{
    swal({
        title:p_title,
        text: p_text,
        icon: "warning",
        buttons: {
            cancel: true,
            confirm: true,
        },
    }).then((willDelete) => {
        p_callb(willDelete);
    });
}