function parseUplink(device, payload)
{

    var switch_mqtt = payload.asJsonObject();
    env.log(switch_mqtt); 
    
    // Parse and store Switch state

    var swit = device.endpoints.byType(endpointType.appliance);
    if (swit != null)
    {
        swit.updateApplianceStatus(switch_mqtt.turnedOn);
    }
}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

  payload.buildResult = downlinkBuildResult.ok; 

	switch (command.type) {
	 	case commandType.management: 
	 	 	switch (command.management.type) { 
	 	 	 	case managementCommandType.setValue:
                    var obj = { 
                        CommandId: command.commandId,
                        Switch: endpoint.address, 
                        Command: "setValue", 
                        Value: command.management.setValue.newValue 
                    };
                    payload.setAsJsonObject(obj);
                    payload.requiresResponse = false;
	 	 	 	 	break; 
	 	 	} 
	 	 	break;
        case commandType.onOff:
            switch (command.onOff.type) { 
	 	 	    case onOffCommandType.turnOn:
	 	 	 	 	var obj = { 
                        CommandId: command.commandId,
                        Switch: endpoint.address, 
                        Command: "TurnOn", 
                    };
                    payload.setAsJsonObject(obj);
                    payload.requiresResponse = false;
	 	 	 	 	break; 
	 	 	 	case onOffCommandType.turnOff: 
	 	 	 	 	var obj = { 
                        CommandId: command.commandId,
                        Switch: endpoint.address, 
                        Command: "TurnOff", 
                    };
                    payload.setAsJsonObject(obj);
                    payload.requiresResponse = true;
	 	 	 	 	break; 
	 	 	 	default: 
	 	 	 	 	payload.buildResult = downlinkBuildResult.unsupported;
	 	 	 	 	break; 
	 	 	} 
	 	 	break;  
	 	default: 
	 	 	payload.buildResult = downlinkBuildResult.unsupported;
            payload.errorMessage = { en: "Unsupported command", es: "Comando no soportado" };
	 	 	break; 
	}

}