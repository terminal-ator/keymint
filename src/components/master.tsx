import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AppState } from '../reducers';
import { ConnectedProps, connect } from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Select } from './styledComp';
import { DialogWrapper } from '../pages/stmt';
import { DialogContent } from './renderDetails';
import styled from 'styled-components';

const mapState = (state: AppState) => {
    return ({
        companyID: state.sys.SelectedCompany
    })
}

const connector = connect(mapState, {})

type Props = ConnectedProps<typeof connector>;

const FETCH_FIELDS = gql`
   query fetchCompany($id: Int){
        getCompany(id: $id){
            id
            beats{
                id
                name
            }
            groups{
                id
                name
            }
        }
    }
`

interface FetchCompany {

    getCompany: {
        id: number
        beats: {
            id: number,
            name: string
        }[],
        groups: {
            id: number,
            name: string
        }[]
    }

}

interface Errors {
    name?: string | undefined
    [key: string]: string | undefined;
}

const MasterContent = styled.div`
    width: 500px;
    float: clear;
    margin: 0px auto;
    position: relative;
`

const MasterForm = (props: Props) => {

    const [fetchFields, { data, loading, error }] = useLazyQuery<FetchCompany>(FETCH_FIELDS);
    const inputR = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log(`Got company id : ${props.companyID}`)
        if (props.companyID) {
            fetchFields({ variables: { id: props.companyID } })
        }
    }, [props.companyID
    ])

    useEffect(() => {
        if (inputR && inputR.current) {
            inputR.current.focus()
        }
    })

    // if (loading) return <div>Loading.......</div>
    // if (error) return <div>{error.message}</div>
    console.log(data)


    return (
        <DialogWrapper>
            <MasterContent>
                <Formik
                    initialValues={{ name: "", beatID: 1, groupID: 1 }}
                    onSubmit={(values) => {
                        window.alert(JSON.stringify(values))
                    }
                    }
                    validate={(values) => {
                        let errors: Errors = {};
                        if (!values.name) {
                            errors.name = "Name is required";
                        }
                        return errors;
                    }}
                >
                    {
                        ({ }) => (
                            <Form style={{ display: "block", padding: 10, width: 500, margin: '10px auto' }} className='card'>
                                <div className="form-group">
                                    <label className="mr-2" htmlFor="name">Name </label>
                                    <Field innerRef={inputR} type="text" placeholder="name" name="name" />
                                    <ErrorMessage name="name" className="ml-5" />
                                </div>
                                <div className="form-group">
                                    <label className="mr-2" htmlFor="groupid" >Group </label>
                                    {data && <Field name="groupID" as={Select} >
                                        {
                                            data.getCompany.groups.map((g) => <option key={g.id} value={g.id} >{g.name}</option>)
                                        }
                                    </Field>}
                                </div>
                                <div className="form-group">
                                    <label className="mr-2" htmlFor="beatID" >Beat</label>
                                    {data && <Field as={Select} name="beatID">
                                        {
                                            data.getCompany.beats.map((b) => <option key={b.id} value={b.id} >{b.name}</option>)
                                        }
                                    </Field>}
                                </div>
                                <button className="btn btn-primary btn-block" type="submit">Create</button>

                            </Form>
                        )
                    }

                </Formik>
            </MasterContent>
        </DialogWrapper>
    )
}


export default connector(MasterForm);