import {OBSWebSocket} from 'obs-websocket-js';
import NodedbJson from "nodedb-json";
const db = new NodedbJson('./db.json')
const defaultobsdata = db.get("defaultobsdata") || {//JSON.parse(localStorage.getItem("defaultobsdata"))||
    ip: "127.0.0.1",
    port: 4455,
    auth: {
        check: null,
        password: "change_me",
    }
}
class OBSController {
    constructor(ip,port,auth,connect) {
        this.obs = new OBSWebSocket();;
        this.isConnected = false;
        this.ip = ip || "127.0.0.1";
        this.port = port || 4455;
        this.auth = auth || null;
        if (connect) this.connect(ip,port,auth);
    }

    // Connection Methods
    async connect(ip=this.ip, port=this.port, auth=this.auth) {
        const url = `ws://${ip}:${port}` || 'ws://127.0.0.1:4455';
        //document.getElementById('connectionStatus').setAttribute('status', 'connected');
        try {
            let response;
            if (auth) {
                console.log("url conectar",url,auth);
                response = await this.obs.connect(url, auth,{rpcVersion: 1});
                db.set("defaultobsdata",{...defaultobsdata,ip:ip,port:port,auth:{check:true,password:auth}});
               
            } else {
                console.log("url conectar",url);
                response = await this.obs.connect(url, undefined,{rpcVersion: 1});
                db.set("defaultobsdata",{...defaultobsdata,ip:ip,port:port,auth:{check:false,password:auth}});
               
            }
            this.isConnected = true;
            this.initializeObsEvents();
            console.log("Conectado a OBS exitosamente");
            return response;
        } catch (error) {
            console.error("Error al conectar a OBS:", error);
            this.isConnected = false;
        }
    }



    // Event Handling
    async initializeObsEvents() {
        async function getCurrentProgramSceneName() {
            const { currentProgramSceneName } = await this.obs.call('GetCurrentProgramScene');
            console.log(currentProgramSceneName);
            return currentProgramSceneName;
        }

        function onCurrentSceneChanged(event) {
            console.log('Current scene changed to', event.sceneName);
        }

        this.obs.on('CurrentSceneChanged', onCurrentSceneChanged);

        this.obs.once('ExitStarted', () => {
            console.log('OBS started shutdown');
            this.isConnected = false;
            this.obs.off('CurrentSceneChanged', onCurrentSceneChanged);
        });
    }

    // Getter Methods (Obtain Information)
    async getScenesList() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetSceneList');
            console.log("Lista de escenas:", response);
            return response;
        } catch (error) {
            console.warn("obtener la lista de escenas", error);
        }
    }
    async GetSceneItemList(sceneName) {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetSceneItemList', {sceneName});
            console.log("Lista de elementos de la escena:", response);
            return response;
        } catch (error) {
            console.warn("obtener la lista de elementos de la escena", error);
        }
    }
    async getVersion() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetVersion');
            console.log("Versión de OBS:", response);
            return response;
        } catch (error) {
            console.warn("obtener la versión de OBS", error);
        }
    }

    async getStats() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetStats');
            console.log("Estadísticas del sistema:", response);
            return response;
        } catch (error) {
            console.warn("obtener estadísticas del sistema", error);
        }
    }

    async getHotkeyList() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetHotkeyList');
            console.log("Lista de hotkeys:", response);
            return response;
        } catch (error) {
            console.warn("obtener la lista de hotkeys", error);
        }
    }

    async getProfileList() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetProfileList');
            console.log("Lista de perfiles:", response);
            return response;
        } catch (error) {
            console.warn("obtener la lista de perfiles", error);
        }
    }

    async getVideoSettings() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetVideoSettings');
            console.log("Ajustes de video:", response);
            return response;
        } catch (error) {
            console.warn("obtener los ajustes de video", error);
        }
    }

    async getRecordDirectory() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetRecordDirectory');
            console.log("Directorio de grabación:", response);
            return response;
        } catch (error) {
            console.warn("obtener el directorio de grabación", error);
        }
    }

    async getSourceActive(sourceName) {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetSourceActive', { sourceName });
            console.log(`Estado de actividad de ${sourceName}:`, response);
            return response;
        } catch (error) {
            console.warn(`obtener el estado de actividad de ${sourceName}`, error);
        }
    }

    async getStreamStatus() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetStreamStatus');
            console.log("Estado del streaming:", response);
            return response;
        } catch (error) {
            console.warn("obtener el estado del streaming", error);
        }
    }

    async getRecordStatus() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetRecordStatus');
            console.log("Estado de grabación:", response);
            return response;
        } catch (error) {
            console.warn("obtener el estado de grabación", error);
        }
    }

    async getVirtualCamStatus() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetVirtualCamStatus');
            console.log("Estado de la cámara virtual:", response);
            return response;
        } catch (error) {
            console.warn("obtener el estado de la cámara virtual", error);
        }
    }

    async getSceneTransitionList() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetSceneTransitionList');
            console.log("Lista de transiciones:", response);
            return response;
        } catch (error) {
            console.warn("obtener la lista de transiciones", error);
        }
    }

    async getCurrentSceneTransition() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetCurrentSceneTransition');
            console.log("Transición actual:", response);
            return response;
        } catch (error) {
            console.warn("obtener la transición actual", error);
        }
    }

    async getGroupList() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetGroupList');
            console.log("Lista de grupos:", response);
            return response;
        } catch (error) {
            console.warn("obtener la lista de grupos", error);
        }
    }

    async getInputList() {
        try {
            await this._checkConnection();
            const response = await this.obs.call('GetInputList');
            let allinputsinfo = { ...response };
    
            // Usar un ciclo for...of para esperar la resolución de las promesas
            for (const input of response.inputs) {
                try {
                    // Intentar obtener el volumen de entrada para cada input
                    const inputVolume = await this.obs.call('GetInputVolume', { inputName: input.inputName });
                    console.log("inputVolume", inputVolume);
    
                    // Comprobar si existe alguna de las propiedades de volumen
                    if (inputVolume.inputVolumeDb || inputVolume.inputVolumeMul) {
                        // Encontrar el objeto correspondiente en allinputsinfo
                        const lastinput = allinputsinfo.inputs.find(lastinput => lastinput.inputName === input.inputName);
    
                        if (lastinput) {
                            // Añadir los valores si existen
                            if (inputVolume.inputVolumeDb !== undefined) {
                                lastinput.inputVolumeDb = inputVolume.inputVolumeDb;
                            }
                            if (inputVolume.inputVolumeMul !== undefined) {
                                lastinput.inputVolumeMul = inputVolume.inputVolumeMul;
                            }
                        }
                    }
                } catch (error) {
                    // Si el input no soporta audio o ocurre un error, simplemente logueamos el error y seguimos
                    console.warn(`No se pudo obtener el volumen para el input ${input.inputName}:`, error.message);
                }
            }
    
            console.log("Lista de fuentes de entrada con volúmenes:", allinputsinfo);
            return allinputsinfo;
        } catch (error) {
            console.warn("Error al obtener la lista de fuentes de entrada:", error);
        }
    }
    

    async getAudioSources() {
        try {
            await this._checkConnection()
            const response = await this.obs.call('GetSpecialInputs');
            console.log("Lista de fuentes de audio en el mezclador:", response);
            return response;
        } catch (error) {
            console.warn("obtener las fuentes de audio", error);
        }
    }

    // Setter Methods (Modify State)
    async setCurrentScene(sceneName) {
        try {
            await this._checkConnection()
            await this.obs.call('SetCurrentProgramScene', { sceneName });
            console.log(`Cambiado a la escena: ${sceneName}`);
        } catch (error) {
            console.warn("cambiar de escena", error);
        }
    }

    async SetStreamServiceSettings(settings) {
        try {
            await this._checkConnection()
            await this.obs.call('SetStreamServiceSettings', settings);
            console.log("Configuración de stream actualizada");
        } catch (error) {
            console.warn("actualizar configuración de stream", error);
        }
    }

    async setSourceVisibility(sceneName, sceneItemId, isVisible) {
        try {
            await this._checkConnection()
            await this.obs.call('SetSceneItemEnabled', {sceneName, sceneItemId: sceneItemId,
                sceneItemEnabled: isVisible });
            console.log(`Visibilidad de ${sceneName} establecida a: ${isVisible}`);
        } catch (error) {
            console.warn(`modificar la visibilidad de ${sceneItemId}`, error);
        }
    }
    async createClip(durationSeconds = 30) {
        
        await this._checkConnection()
        try {
            // Verificar el estado actual de la grabación
            const recordStatus = await this.getRecordStatus();
            
            // Si ya está grabando, retornamos para evitar interrumpir la grabación existente
            if (recordStatus.outputActive) {
                console.log("Ya existe una grabación en curso");
                return false;
            }

            // Iniciar la grabación
            await this.obs.call('StartRecord');
            console.log("Iniciando grabación del clip...");

            // Esperar la duración especificada
            await new Promise(resolve => setTimeout(resolve, durationSeconds * 1000));

            // Detener la grabación
            await this.obs.call('StopRecord');
            console.log(`Clip de ${durationSeconds} segundos creado exitosamente`);

            // Obtener la ruta del último archivo grabado
            const recordDirectory = await this.getRecordDirectory();
            return {
                success: true,
                duration: durationSeconds,
                directory: recordDirectory
            };

        } catch (error) {
            console.warn("crear el clip", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Método para configurar y manejar el replay buffer
    async setupReplayBuffer(bufferDuration = 30) {
        
        await this._checkConnection()
        try {
            // Verificar si el replay buffer ya está activo
            const replayBufferStatus = await this.obs.call('GetReplayBufferStatus');
            
            if (replayBufferStatus.outputActive) {
                console.log("El replay buffer ya está activo");
                return {
                    success: true,
                    status: 'already_active'
                };
            }
            // Iniciar el replay buffer
            await this.obs.call('StartReplayBuffer');
            console.log(`Replay buffer iniciado con duración de ${bufferDuration} segundos`);
            setTimeout(() => {
                this.obs.call('StopReplayBuffer');
                console.log("Replay buffer detenido");
                resolve(true);
                this.obs.call('SaveReplayBuffer');
            }, bufferDuration * 1000);

            return {
                success: true,
                bufferDuration: bufferDuration
            };

        } catch (error) {
            console.warn("configurar el replay buffer", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Método para guardar el replay buffer actual
    async saveReplayBuffer() {
        
        await this._checkConnection()
        try {
            // Verificar si el replay buffer está activo
            const replayBufferStatus = await this.obs.call('GetReplayBufferStatus');
            
            if (!replayBufferStatus.outputActive) {
                console.log("El replay buffer no está activo");
                return {
                    success: false,
                    error: 'replay_buffer_inactive'
                };
            }

            // Guardar el replay buffer
            await this.obs.call('SaveReplayBuffer');
            console.log("Replay guardado exitosamente");

            return {
                success: true,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.warn("guardar el replay", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async stopReplayBuffer() {
        
        await this._checkConnection()
        try {
            await this.obs.call('StopReplayBuffer');
            console.log("Replay buffer detenido");
            return {
                success: true
            };
        } catch (error) {
            console.warn("detener el replay buffer", error);
            return {
                success: false,
                error: error.message
            };
        }
    }
        /**
     * Establece el volumen de una fuente de audio
     * @param {string} inputName - Nombre de la fuente de audio
     * @param {Object} options - Opciones de volumen
     * @param {number} [options.db] - Volumen en decibelios (dB)
     * @param {number} [options.multiplier] - Multiplicador de volumen (0.0 a 1.0)
     * @param {boolean} [options.smooth=false] - Si se debe hacer una transición suave
     * @param {number} [options.smoothDuration=100] - Duración de la transición en ms
     */
        async setInputVolume(inputName, options = {}) {
    
            await this._checkConnection()
            try {
                // Preparar los parámetros para la llamada
                const params = {
                    inputName: inputName
                };
    
                // Si se proporciona dB, usamos ese valor
                if (options.db !== undefined) {
                    params.inputVolumeDb = options.db;
                }
                // Si se proporciona multiplicador, usamos ese valor
                else if (options.multiplier !== undefined) {
                    params.inputVolumeMul = Math.max(0, Math.min(1, options.multiplier));
                }
    
                // Transición suave si se solicita
                if (options.smooth) {
                    // Obtener volumen actual
                    const currentVolume = await this.obs.call('GetInputVolume', { inputName });
                    
                    // Calcular pasos para la transición suave
                    const steps = 10;
                    const duration = options.smoothDuration || 100;
                    const stepTime = duration / steps;
                    
                    let startValue, endValue;
                    if (options.db !== undefined) {
                        startValue = currentVolume.inputVolumeDb;
                        endValue = options.db;
                    } else {
                        startValue = currentVolume.inputVolumeMul;
                        endValue = params.inputVolumeMul;
                    }
    
                    // Realizar la transición suave
                    for (let i = 0; i <= steps; i++) {
                        const progress = i / steps;
                        const currentValue = startValue + (endValue - startValue) * progress;
                        
                        if (options.db !== undefined) {
                            await this.obs.call('SetInputVolume', {
                                inputName,
                                inputVolumeDb: currentValue
                            });
                        } else {
                            await this.obs.call('SetInputVolume', {
                                inputName,
                                inputVolumeMul: currentValue
                            });
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, stepTime));
                    }
                } else {
                    // Cambio directo de volumen
                    await this.obs.call('SetInputVolume', params);
                }
    
                // Obtener el volumen actualizado para confirmar
                const updatedVolume = await this.obs.call('GetInputVolume', { inputName });
                
                console.log(`Volumen de ${inputName} actualizado:`, {
                    decibelios: updatedVolume.inputVolumeDb.toFixed(1) + 'dB',
                    multiplicador: updatedVolume.inputVolumeMul.toFixed(2)
                });
    
                return {
                    success: true,
                    inputName,
                    currentVolume: {
                        db: updatedVolume.inputVolumeDb,
                        multiplier: updatedVolume.inputVolumeMul
                    }
                };
    
            } catch (error) {
                console.warn(`ajustar el volumen de ${inputName}`, error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    
        /**
         * Obtiene el volumen actual de una fuente de audio
         * @param {string} inputName - Nombre de la fuente de audio
         */
        async getInputVolume(inputName) {
    
            await this._checkConnection()
            try {
                const response = await this.obs.call('GetInputVolume', { inputName });
                
                console.log(`Volumen actual de ${inputName}:`, {
                    decibelios: response.inputVolumeDb.toFixed(1) + 'dB',
                    multiplicador: response.inputVolumeMul.toFixed(2)
                });
    
                return {
                    success: true,
                    inputName,
                    volume: {
                        db: response.inputVolumeDb,
                        multiplier: response.inputVolumeMul
                    }
                };
    
            } catch (error) {
                console.warn(`obtener el volumen de ${inputName}`, error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }
        async setAudioMute(inputName, mute) {
            try {
            await this._checkConnection()
                await this.obs.call('SetInputMute', {
                    inputName: inputName,
                    inputMuted: mute
                });
                console.log(`${inputName} ${mute ? 'silenciado' : 'desilenciado'}`);
                return true;
            } catch (error) {
                console.warn(`${mute ? 'silenciar' : 'desilenciar'} ${inputName}`, error);
                return false;
            }
        }
    // Utility Methods
    async _checkConnection(timeout = 1000, retries = 3, delay = 400) {
        return new Promise(async (resolve, reject) => {
            // Intentar varias veces si no está conectado
            for (let attempt = 1; attempt <= retries; attempt++) {
                // Si ya está conectado, resolvemos inmediatamente
                if (this.isConnected) {
                    resolve(true);
                    return;
                }
    
                // Si no está conectado y no es el último intento, esperamos antes de volver a intentar
                if (attempt < retries) {
                    console.log(`Intento ${attempt} fallido. Reintentando en ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                }
            }
    
            // Si después de los reintentos sigue sin estar conectado, rechazamos la promesa
            reject(new Error("No se pudo establecer conexión con OBS"));
        });
    }
    

    _handleError(action, error) {
        console.error(`Error al ${action}:`, error);
        return null;
    }
}

const authenabled = !defaultobsdata.auth.check ? defaultobsdata.auth.check : defaultobsdata.auth;
const obsController = new OBSController(defaultobsdata.ip,defaultobsdata.port,authenabled,true);
let lastArrayScenes = [];
async function getAllscenes() {
    //return array with scenes, scenes.sceneName || sourceName
    const scenes = await obsController.getScenesList();
    lastArrayScenes = scenes?.scenes || [];
    if(lastArrayScenes)localStorage.setItem("lastArrayScenes",JSON.stringify(scenes?.scenes||lastArrayScenes));
    return JSON.parse(localStorage.getItem("lastArrayScenes"));
}
let lastArrayinputs = [];
async function getAllinputs() {
    const inputs = await obsController.getInputList();
    lastArrayinputs = inputs?.inputs || [];
    if(lastArrayinputs)localStorage.setItem("lastArrayinputs",JSON.stringify(inputs?.inputs||lastArrayinputs));
    return JSON.parse(localStorage.getItem("lastArrayinputs"));
}
async function setInputVolume(inputName,db,multiplier) {
    console.log("setInputVolume",inputName,db,multiplier)
    if (!inputName || db === undefined || typeof db !== 'number' && multiplier === undefined || typeof db !== 'number' && !db && !multiplier) return;
    //console.log("setInputVolume",inputName,db,multiplier)
    if (db >= 0) db * -1;
    if (db < -100 || db > 0) db = 0;
    if (!db && multiplier > 1 && multiplier <= 0) multiplier = 1;
    const response = await obsController.setInputVolume(inputName,{db:db,multiplier:multiplier});
    return response;
}
async function setAudioMute(inputName,toggle) {
    //console.log("setAudioMute",inputName,toggle)
    if (!inputName || toggle === undefined || typeof toggle !== 'boolean') return;
    const response = await obsController.setAudioMute(inputName,toggle);
    return response;
}
async function getSourceActive(sourceName) {
    const response = await obsController.getSourceActive(sourceName);
    return response;
}
async function GetSceneItemList(sceneName) {
    //return array scenes.sceneName || sourceName.sources [{sceneItems: Array(4) [ {…}, {…}, {…}, … ]0: Object { inputKind: "jack_output_capture", sceneItemBlendMode: "OBS_BLEND_NORMAL", sceneItemEnabled: true,}]
    const response = await obsController.GetSceneItemList(sceneName);
    return response;
}
async function setSourceVisibility(sceneName, sceneItemId, isVisible) {
    const setSourceVisibility = await obsController.setSourceVisibility(sceneName, sceneItemId, isVisible);
return setSourceVisibility;
}
async function setCurrentScene(sceneName) {
    const response = await obsController.setCurrentScene(sceneName);    
    return response;
}
async function createClip(durationSeconds = 30) {
    const response = await obsController.createClip(durationSeconds);
    return response;
}
const functionsWithoutParams = {
    "getScenesList": obsController.getScenesList.bind(obsController),
    "getVersion": obsController.getVersion.bind(obsController),
    "getStats": obsController.getStats.bind(obsController),
    "getHotkeyList": obsController.getHotkeyList.bind(obsController), 
    "getProfileList": obsController.getProfileList.bind(obsController),
    "getVideoSettings": obsController.getVideoSettings.bind(obsController),
    "getRecordDirectory": obsController.getRecordDirectory.bind(obsController),
    "getStreamStatus": obsController.getStreamStatus.bind(obsController),
    "getRecordStatus": obsController.getRecordStatus.bind(obsController),
    "getVirtualCamStatus": obsController.getVirtualCamStatus.bind(obsController),
    "getSceneTransitionList": obsController.getSceneTransitionList.bind(obsController),
    "getCurrentSceneTransition": obsController.getCurrentSceneTransition.bind(obsController),
    "getGroupList": obsController.getGroupList.bind(obsController),
    "getInputList": obsController.getInputList.bind(obsController),
    "getAudioSources": obsController.getAudioSources.bind(obsController),
    "checkconnection": obsController._checkConnection.bind(obsController)
};
const arrayobs = {
    "getScenesList": { function: obsController.getScenesList.bind(obsController), name: "getScenesList", requiredparams: [] },
    "getVersion": { function: obsController.getVersion.bind(obsController), name: "getVersion", requiredparams: [] },
    "getStats": { function: obsController.getStats.bind(obsController), name: "getStats", requiredparams: [] },
    "getHotkeyList": { function: obsController.getHotkeyList.bind(obsController), name: "getHotkeyList", requiredparams: [] },
    "getProfileList": { function: obsController.getProfileList.bind(obsController), name: "getProfileList", requiredparams: [] },
    "getVideoSettings": { function: obsController.getVideoSettings.bind(obsController), name: "getVideoSettings", requiredparams: [] },
    "getRecordDirectory": { function: obsController.getRecordDirectory.bind(obsController), name: "getRecordDirectory", requiredparams: [] },
    "getStreamStatus": { function: obsController.getStreamStatus.bind(obsController), name: "getStreamStatus", requiredparams: [] },
    "getRecordStatus": { function: obsController.getRecordStatus.bind(obsController), name: "getRecordStatus", requiredparams: [] },
    "getVirtualCamStatus": { function: obsController.getVirtualCamStatus.bind(obsController), name: "getVirtualCamStatus", requiredparams: [] },
    "getSceneTransitionList": { function: obsController.getSceneTransitionList.bind(obsController), name: "getSceneTransitionList", requiredparams: [] },
    "getCurrentSceneTransition": { function: obsController.getCurrentSceneTransition.bind(obsController), name: "getCurrentSceneTransition", requiredparams: [] },
    "getGroupList": { function: obsController.getGroupList.bind(obsController), name: "getGroupList", requiredparams: [] },
    "getInputList": { function: obsController.getInputList.bind(obsController), name: "getInputList", requiredparams: [] },
    "getAudioSources": { function: obsController.getAudioSources.bind(obsController), name: "getAudioSources", requiredparams: [] },
    "checkconnection": { function: obsController._checkConnection.bind(obsController), name: "checkconnection", requiredparams: [] },
    
    "getSourceActive": { function: obsController.getSourceActive.bind(obsController), name: "getSourceActive", requiredparams: ["sourceName"] },
    "getInputVolume": { function: obsController.getInputVolume.bind(obsController), name: "getInputVolume", requiredparams: ["inputName"] },//params is inputName
    "setCurrentScene": { function: setCurrentScene, name: "setCurrentScene", requiredparams: ["sceneName"] },
    "createClip": { function: createClip, name: "createClip", requiredparams: ["duration"] },
    "setupReplayBuffer": { function: obsController.setupReplayBuffer.bind(obsController), name: "setupReplayBuffer", requiredparams: ["duration"] },

    "setInputVolume": { function: setInputVolume, name: "setInputVolume", requiredparams: ["inputName","db","multiplier"] },//params is inputName and {db:Number(0),multiplier:Number(1)}
    "setAudioMute": { function: setAudioMute, name: "setAudioMute", requiredparams: ["inputName","toggle"] },//params is inputName and mute boolean

    "setSourceVisibility": { function: obsController.setSourceVisibility.bind(obsController), name: "setSourceVisibility", requiredparams: ["sceneName", "sceneItemId", "toggle"] },//params is sceneName and sceneItemId visivility bolean
    "connect": { function: obsController.connect.bind(obsController), name: "connect", requiredparams: ["ip","port","auth"] }
};
const mapedarrayobs = Object.entries(arrayobs).map(([key, value]) => ({ value:key, label: key, requiredparams: value.requiredparams }));
// hacemos una version de la funcion anterior pero usando async/await y try catch
async function executebykeyasync(key= "getVersion") {
    const valueobsaction = functionsWithoutParams[key];
    if (valueobsaction) {
        try {
            const response = await valueobsaction();
            return response;
        } catch (error) {
            console.error("Error al ejecutar la función:", error);
            return error;
        }
    }
}
/* const functionsmoreused = {
    connectobs: connectobs,
    getAllscenes: getAllscenes,
    getAllinputs: getAllinputs,
    setInputVolume: setInputVolume,
    setAudioMute: setAudioMute,
    getSourceActive: getSourceActive,
    setCurrentScene: setCurrentScene,
    GetSceneItemList: GetSceneItemList,
    setSourceVisibility: setSourceVisibility,
    createClip: createClip,
} */
export { mapedarrayobs, arrayobs,functionsWithoutParams,executebykeyasync };