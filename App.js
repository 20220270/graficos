import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const App = () => {
    // Estados para manejar los datos del formulario y la lista de clientes
    const [nombre, setNombre] = useState('');
    const [fechaReserva, setFechaReserva] = useState(new Date());
    const [cantidadReserva, setCantidadReserva] = useState(''); 
    const [clientes, setClientes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [show, setShow] = useState(false);

    // Función que maneja el cambio de fecha en el DateTimePicker
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || fechaReserva; // Mantiene la fecha actual si no se selecciona una nueva
        setShow(false); // Oculta el DateTimePicker
        setFechaReserva(currentDate); // Actualiza la fecha de reserva
    };

    // Función para mostrar el DateTimePicker
    const showDatepicker = () => {
        setShow(true);
    };

    // Función para agregar un nuevo cliente
    const agregarCliente = () => {
        // Validación del nombre del cliente
        if (nombre.trim() === '') {
            alert('El nombre del cliente no puede estar vacío');
            return;
        }
        // Validación de la cantidad de reserva
        if (cantidadReserva.trim() === '' || isNaN(cantidadReserva) || parseInt(cantidadReserva) <= 0) {
            alert('La cantidad de reserva debe ser un número válido mayor a 0');
            return;
        }

        // Crear un nuevo cliente con un ID único basado en el último cliente en la lista
        const nuevoCliente = {
            id: clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1,
            nombre,
            fechaReserva,
            cantidadReserva: parseInt(cantidadReserva), // Convierte la cantidad de reserva a número
        };

        // Actualiza la lista de clientes con el nuevo cliente
        setClientes([...clientes, nuevoCliente]);
        // Resetea los campos del formulario
        setNombre('');
        setFechaReserva(new Date());
        setCantidadReserva('');
        setModalVisible(false); // Cierra el modal
    };

    // Función para eliminar un cliente y reindexar los IDs
    const eliminarCliente = (id) => {
        // Filtra la lista de clientes para eliminar el cliente con el ID especificado y reindexa los IDs
        const nuevosClientes = clientes.filter((cliente) => cliente.id !== id).map((cliente, index) => ({
            ...cliente,
            id: index + 1, // Reindexa los IDs
        }));
        setClientes(nuevosClientes); // Actualiza la lista de clientes
    };

    return (
        <View style={styles.container}>
            {/* Botón para abrir el modal de agregar cliente */}
            <Button title="Agregar Cliente" onPress={() => setModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible); // Cierra el modal si se solicita
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Campo de entrada para el nombre del cliente */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del Cliente"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        {/* Campo de entrada para la cantidad de reserva */}
                        <TextInput
                            style={styles.input}
                            placeholder="Cantidad de Reserva"
                            value={cantidadReserva}
                            onChangeText={setCantidadReserva}
                            keyboardType="numeric" // Establece el teclado para entrada numérica
                        />
                        {/* Botón para mostrar el DateTimePicker */}
                        <TouchableOpacity onPress={showDatepicker}>
                            <Text>Seleccionar fecha de Reserva</Text>
                        </TouchableOpacity>
                        {/* Muestra la fecha seleccionada */}
                        <Text>Fecha seleccionada: {fechaReserva.toLocaleString()}</Text>
                        {/* Muestra el DateTimePicker si show es verdadero */}
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={fechaReserva}
                                mode="date"
                                is24Hour={false}
                                onChange={onChange}
                                locale="es-ES" // Establece el idioma del DateTimePicker a español
                            />
                        )}
                        {/* Botón para agregar el cliente */}
                        <Button title="Agregar Cliente" onPress={agregarCliente} />
                        {/* Botón para cancelar y cerrar el modal */}
                        <Button
                            title="Cancelar"
                            onPress={() => setModalVisible(false)}
                            color="red"
                        />
                    </View>
                </View>
            </Modal>
            {/* Lista de clientes */}
            <FlatList
                data={clientes}
                renderItem={({ item }) => (
                    <View style={styles.clienteItem}>
                        {/* Muestra los datos del cliente */}
                        <Text style={styles.clienteNombre}>ID: {item.id}</Text>
                        <Text style={styles.clienteNombre}>Nombre: {item.nombre}</Text>
                        <Text style={styles.clienteFecha}>Fecha de Reserva: {item.fechaReserva.toDateString()}</Text>
                        <Text style={styles.clienteCantidad}>Cantidad de Reserva: {item.cantidadReserva}</Text>
                        {/* Botón para eliminar el cliente */}
                        <Button
                            title="Eliminar"
                            onPress={() => eliminarCliente(item.id)}
                            color="red"
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()} // Usa el ID del cliente como clave única
            />
        </View>
    );
};

// Estilos de la aplicación
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001222',
        padding: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    clienteItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    clienteNombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    clienteFecha: {
        fontSize: 16,
    },
    clienteCantidad: {
        fontSize: 16,
    },
});

export default App;
