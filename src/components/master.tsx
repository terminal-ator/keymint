import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AppState } from '../reducers';
import { ConnectedProps, connect } from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Select } from './styledComp';
import styled from 'styled-components';
import { FetchMasters } from "../actions/masterActions";
import { Input, message } from 'antd';
import { postCreateMaster } from '../api';
import { Master } from '../types/master';

const mapState = (state: AppState) => {
    return ({
        companyID: state.sys.SelectedCompany
    })
}
interface XProps {
    master?: Master
}
const connector = connect(mapState, { FetchMasters })

type Props = ConnectedProps<typeof connector> & XProps;

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

export interface FormValues {
    name: string
    beat_id: number;
    group_id: number;
    i_code: string;
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
        <Formik
            initialValues={{ name: "", beat_id: 1, group_id: 1, i_code: "GENERIC" }}
            onSubmit={async (values: FormValues, { resetForm }) => {
                // window.alert(JSON.stringify(values))
                const resp = await postCreateMaster(values, props.companyID);
                if (resp.status == 200) {
                    message.success("Successfully added new master");
                    props.FetchMasters(props.companyID)
                    resetForm();
                } else {
                    message.error("Failed, please try again")
                }

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
                    <Form style={{ display: "block", padding: 10, margin: '10px auto' }} className='card'>
                        <div className="form-group">
                            <label className="mr-2" htmlFor="name">Name </label>
                            <Field innerRef={inputR} as={Input} type="text" placeholder="name" name="name" />
                            <ErrorMessage name="name" className="ml-5" />
                        </div>
                        <div className="form-group">
                            <label className="mr-2" htmlFor="i_code">Interface</label>
                            <Field innerRef={inputR} as={Input} type="text" placeholder="Interface" name="i_code" />
                            <ErrorMessage name="interface" className="ml-5" />
                        </div>
                        <div className="form-group">
                            <label className="mr-2" htmlFor="group_id" >Group </label>
                            {data && <Field name="group_id" as={Select} >
                                {
                                    data.getCompany.groups.map((g) => <option key={g.id} value={g.id} >{g.name}</option>)
                                }
                            </Field>}
                        </div>
                        <div className="form-group">
                            <label className="mr-2" htmlFor="beat_id" >Beat</label>
                            {data && <Field as={Select} name="beat_id">
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
    )
}


export default connector(MasterForm);