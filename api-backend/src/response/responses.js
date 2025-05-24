//
export const response_success = (p_data, p_message) => {
    return(
        {
            success: true,
            status_code: 200,
            message: p_message,
            data: p_data
        }
    )
}

export const response_create = (p_id, p_message) => {
    return(
        {
            success: true,
            status_code: 201,
            message: p_message,
            record_id: p_id
        }
    )
}

export const response_not_found = (p_message) => {
    return(
        {
            success: false,
            status_code: 404,
            message: p_message
        }
    )
}

export const response_error = (p_message) => {
    return(
        {
            success: false,
            status_code: 500,
            message: p_message
        }
    )
}

export const response_bad_request = (p_message) => {
    return(
        {
            success: false,
            status_code: 400,
            message: p_message
        }
    )
}
