import { useDispatch, useSelector } from 'react-redux';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { v4 as uuidv4 } from 'uuid';

import { heroCreated } from '../../actions';
import { useHttp } from '../../hooks/http.hook';


// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const {filters} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const renderFilters = (filters) => {
        return filters.map(({value, text}) => {
            if (value === 'all') {
                return;
            }
            return (
                <option key={uuidv4()} value={value}>{text}</option>
            )
        })
    }

    const options = renderFilters(filters);

    return (
        <div className="border p-4 shadow-lg rounded">
            <Formik 
                initialValues={{
                    id: '',
                    name: '',
                    description: '',
                    element: ''
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required'),
                    description: Yup.string().required('This field is required'),
                    element: Yup.string().required('Choose an element')
                })}
                onSubmit={(values, {resetForm}) => {
                    values.id = uuidv4();
                    const newHero = JSON.parse(JSON.stringify(values, null, 2))
                    
                    request('http://localhost:3001/heroes', 'POST', JSON.stringify(values))
                        .then(res => console.log(res, 'Successfully sent'))
                        .then(dispatch(heroCreated(newHero)))
                        .then(resetForm())
                        .catch(err => console.log(err));
                }}>

                <Form>
                    
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                        <Field 
                            name="name" 
                            id="name" 
                            type="text"
                            placeholder='Как меня зовут?' 
                            className="form-control"/>
                        <ErrorMessage style={{color: '#dc3545'}} name='name' component='div'/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label fs-4">Описание</label>
                        <Field
                            name="description"
                            placeholder='Что я умею?' 
                            id="description" 
                            className="form-control"
                            as="textarea"
                            style={{"height": '130px'}}/>
                        <ErrorMessage style={{color: '#dc3545'}} name='description' component='div'/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                        <Field 
                            as="select"
                            required
                            className="form-select" 
                            id="element" 
                            name="element">
                            <option >Я владею элементом...</option>
                            {options}
                        </Field>
                        <ErrorMessage style={{color: '#dc3545'}} name='element' component='div'/>
                    </div>

                    <button type="submit" className="btn btn-primary">Создать</button>
                </Form>
            </Formik>
        </div>
    )
}

export default HeroesAddForm;