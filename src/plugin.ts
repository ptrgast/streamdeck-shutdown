import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { Shutdown } from "./actions/shutdown";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded.
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register action(s)
streamDeck.actions.registerAction(new Shutdown());

// Finally, connect to the Stream Deck.
streamDeck.connect();
