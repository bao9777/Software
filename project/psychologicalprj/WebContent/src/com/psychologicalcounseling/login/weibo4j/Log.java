package com.psychologicalcounseling.login.weibo4j;

import org.apache.log4j.Logger;

public class Log {
	
	static Logger log = Logger.getLogger(Log.class.getName());
	// PropertyConfigurator.configure ( String configFilename) 
    public static void logDebug(String message) {
			log.debug(message);
	}

	public static void logInfo(String message) {
			log.info(message);
	}


}
